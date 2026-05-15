<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::published()->with(['category', 'images']);

        if ($category = $request->string('category')->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($city = $request->string('city')->toString()) {
            $query->where('city', $city);
        }

        if ($search = $request->string('q')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        $projects = $query
            ->orderByDesc('featured')
            ->orderByDesc('completed_at')
            ->orderByDesc('id')
            ->paginate(min($request->integer('per_page', 12), 50));

        return ProjectResource::collection($projects);
    }

    public function show(string $slug)
    {
        $project = Project::published()
            ->with(['category', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProjectResource($project);
    }

    /**
     * Liste des villes distinctes parmi les projets publiés (pour les filtres).
     */
    public function cities()
    {
        $cities = Project::published()
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->select('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return response()->json(['data' => $cities]);
    }
}
