<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectImageResource;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Support\ImageProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectImageController extends Controller
{
    /** Poids max par fichier : 12 Mo pour une image, 100 Mo pour une vidéo. */
    private const MAX_IMAGE_KB = 12288;
    private const MAX_VIDEO_KB = 102400;

    public function store(Request $request, Project $project): JsonResponse
    {
        // Le champ s'appelle "images" pour compatibilité, mais accepte
        // désormais aussi les vidéos de réalisations (mp4, mov, webm).
        $request->validate([
            'images' => ['required', 'array', 'min:1', 'max:20'],
            'images.*' => [
                'required', 'file',
                'mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm',
                'max:' . self::MAX_VIDEO_KB,
            ],
        ]);

        // Taille max différenciée : GD chargerait une image de 100 Mo en mémoire.
        foreach ($request->file('images', []) as $i => $file) {
            $isVideo = str_starts_with((string) $file->getMimeType(), 'video/');
            if (!$isVideo && $file->getSize() > self::MAX_IMAGE_KB * 1024) {
                return response()->json([
                    'message' => 'Image trop lourde (max 12 Mo) : ' . $file->getClientOriginalName(),
                    'errors' => ["images.$i" => ['Image trop lourde (max 12 Mo).']],
                ], 422);
            }
        }

        $created = [];
        $nextOrder = ($project->images()->max('order') ?? -1) + 1;

        foreach ($request->file('images', []) as $file) {
            if (str_starts_with((string) $file->getMimeType(), 'video/')) {
                // Vidéo : stockée telle quelle sur le disque (R2 en prod).
                // Pas de ré-encodage serveur (pas de ffmpeg sur Railway) —
                // le front l'affiche en <video preload="metadata">.
                $path = $file->store('projects/' . $project->id, config('filesystems.default'));

                $image = $project->images()->create([
                    'path' => $path,
                    'type' => 'video',
                    'order' => $nextOrder++,
                    'is_cover' => false,
                ]);
            } else {
                // Image : ré-encodage WebP (strip EXIF/GPS + anti-polyglotte) + vignette.
                try {
                    $processed = ImageProcessor::storeProjectImage($file, $project->id);
                } catch (\Throwable $e) {
                    report($e); // Sentry + logs : la vraie cause, pas un 500 muet

                    return response()->json([
                        'message' => 'Impossible de traiter l\'image « ' . $file->getClientOriginalName()
                            . ' » — le serveur d\'images a signalé : ' . $e->getMessage(),
                    ], 422);
                }

                $image = $project->images()->create([
                    'path' => $processed['path'],
                    'type' => 'image',
                    'thumbnail' => $processed['thumbnail'],
                    'width' => $processed['width'],
                    'height' => $processed['height'],
                    'order' => $nextOrder++,
                    'is_cover' => false,
                ]);
            }

            $created[] = $image;
        }

        // S'il n'y a pas encore de cover, prendre la 1ʳᵉ IMAGE uploadée
        // (jamais une vidéo : la cover sert d'og:image, de vignette de grille…)
        if (!$project->cover_image) {
            $firstImage = collect($created)->firstWhere('type', '!=', 'video');
            if ($firstImage) {
                $project->update([
                    'cover_image' => $firstImage->path,
                    'cover_thumbnail' => $firstImage->thumbnail,
                ]);
                $firstImage->update(['is_cover' => true]);
            }
        }

        return response()->json([
            'data' => ProjectImageResource::collection(collect($created)),
            'message' => count($created) . ' média(s) ajouté(s).',
        ], 201);
    }

    public function setCover(Project $project, ProjectImage $image): JsonResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $project->images()->update(['is_cover' => false]);
        $image->update(['is_cover' => true]);
        $project->update([
            'cover_image' => $image->path,
            'cover_thumbnail' => $image->thumbnail,
        ]);

        return response()->json([
            'data' => new ProjectImageResource($image),
            'message' => 'Image de couverture mise à jour.',
        ]);
    }

    public function destroy(Project $project, ProjectImage $image): JsonResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $disk = Storage::disk(config('filesystems.default'));
        if ($image->path) {
            $disk->delete($image->path);
        }
        if ($image->thumbnail) {
            $disk->delete($image->thumbnail);
        }

        $wasCover = $image->is_cover;
        $image->delete();

        // Si on supprime la cover, repromouvoir la 1ʳᵉ image restante
        if ($wasCover) {
            $first = $project->images()->orderBy('order')->first();
            if ($first) {
                $first->update(['is_cover' => true]);
                $project->update([
                    'cover_image' => $first->path,
                    'cover_thumbnail' => $first->thumbnail,
                ]);
            } else {
                $project->update(['cover_image' => null, 'cover_thumbnail' => null]);
            }
        }

        return response()->json(['message' => 'Image supprimée.']);
    }

    public function reorder(Request $request, Project $project): JsonResponse
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:project_images,id'],
        ]);

        foreach ($request->input('order', []) as $position => $imageId) {
            ProjectImage::where('id', $imageId)
                ->where('project_id', $project->id)
                ->update(['order' => $position]);
        }

        return response()->json([
            'data' => ProjectImageResource::collection($project->images()->get()),
            'message' => 'Ordre mis à jour.',
        ]);
    }

    /**
     * Marque une image comme 'before' / 'after' / 'none'.
     * Les paires before+after consécutives (par order) sont rendues
     * en BeforeAfterSlider côté front.
     */
    public function setBeforeAfter(Request $request, Project $project, ProjectImage $image): JsonResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $request->validate([
            'before_after' => ['required', 'in:none,before,after'],
        ]);

        $image->update(['before_after' => $request->string('before_after')]);

        return response()->json([
            'data' => new ProjectImageResource($image->fresh()),
            'message' => 'Image taguée.',
        ]);
    }
}
