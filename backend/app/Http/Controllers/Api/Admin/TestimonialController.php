<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::with('project:id,title,slug')->orderBy('order')->latest('id');

        if ($request->boolean('published_only')) {
            $query->published();
        }

        return TestimonialResource::collection($query->paginate(min($request->integer('per_page', 30), 100)));
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json([
            'data' => new TestimonialResource($testimonial->load('project')),
        ]);
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $testimonial = Testimonial::create($request->validated());

        return response()->json([
            'data' => new TestimonialResource($testimonial->load('project')),
            'message' => 'Avis ajouté.',
        ], 201);
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): JsonResponse
    {
        $testimonial->update($request->validated());

        return response()->json([
            'data' => new TestimonialResource($testimonial->fresh('project')),
            'message' => 'Avis mis à jour.',
        ]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json(['message' => 'Avis supprimé.']);
    }
}
