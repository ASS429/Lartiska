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
}
