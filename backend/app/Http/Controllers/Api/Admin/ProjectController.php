<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('category:id,name,slug')
            ->withCount('images')
            ->latest('id');

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($category = $request->string('category')->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        return ProjectResource::collection(
            $query->paginate($request->integer('per_page', 20))
        );
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json([
            'data' => new ProjectResource($project->load(['category', 'images'])),
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::create($request->validated());

        return response()->json([
            'data' => new ProjectResource($project->load(['category', 'images'])),
            'message' => 'Projet créé.',
        ], 201);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());

        return response()->json([
            'data' => new ProjectResource($project->fresh()->load(['category', 'images'])),
            'message' => 'Projet mis à jour.',
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        // Supprimer aussi les fichiers physiques
        if ($project->cover_image && str_starts_with($project->cover_image, 'projects/')) {
            Storage::disk('public')->delete($project->cover_image);
        }

        foreach ($project->images as $image) {
            if ($image->path) {
                Storage::disk('public')->delete($image->path);
            }
        }

        $project->images()->delete();
        $project->delete();

        return response()->json(['message' => 'Projet supprimé.']);
    }
}
