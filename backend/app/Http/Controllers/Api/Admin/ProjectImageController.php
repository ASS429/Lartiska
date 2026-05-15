<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectImageResource;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectImageController extends Controller
{
    public function store(Request $request, Project $project): JsonResponse
    {
        $request->validate([
            'images' => ['required', 'array', 'min:1', 'max:20'],
            'images.*' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240'],
        ]);

        $created = [];
        $nextOrder = ($project->images()->max('order') ?? -1) + 1;

        foreach ($request->file('images', []) as $file) {
            $path = $file->store('projects/' . $project->id, 'public');

            $image = $project->images()->create([
                'path' => $path,
                'order' => $nextOrder++,
                'is_cover' => false,
            ]);

            $created[] = $image;
        }

        // S'il n'y a pas encore de cover, prendre la 1ʳᵉ image uploadée
        if (!$project->cover_image && !empty($created)) {
            $project->update(['cover_image' => $created[0]->path]);
            $created[0]->update(['is_cover' => true]);
        }

        return response()->json([
            'data' => ProjectImageResource::collection(collect($created)),
            'message' => count($created) . ' image(s) ajoutée(s).',
        ], 201);
    }

    public function setCover(Project $project, ProjectImage $image): JsonResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $project->images()->update(['is_cover' => false]);
        $image->update(['is_cover' => true]);
        $project->update(['cover_image' => $image->path]);

        return response()->json([
            'data' => new ProjectImageResource($image),
            'message' => 'Image de couverture mise à jour.',
        ]);
    }

    public function destroy(Project $project, ProjectImage $image): JsonResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        if ($image->path) {
            Storage::disk('public')->delete($image->path);
        }

        $wasCover = $image->is_cover;
        $image->delete();

        // Si on supprime la cover, repromouvoir la 1ʳᵉ image restante
        if ($wasCover) {
            $first = $project->images()->orderBy('order')->first();
            if ($first) {
                $first->update(['is_cover' => true]);
                $project->update(['cover_image' => $first->path]);
            } else {
                $project->update(['cover_image' => null]);
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
