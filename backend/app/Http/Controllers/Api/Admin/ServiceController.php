<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('category:id,name,slug')->orderBy('order')->orderBy('id');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->string('category')));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('title', 'like', "%{$search}%");
        }

        return ServiceResource::collection($query->paginate($request->integer('per_page', 30)));
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json([
            'data' => new ServiceResource($service->load('category')),
        ]);
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());

        return response()->json([
            'data' => new ServiceResource($service->load('category')),
            'message' => 'Service créé.',
        ], 201);
    }

    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $service->update($request->validated());

        return response()->json([
            'data' => new ServiceResource($service->fresh('category')),
            'message' => 'Service mis à jour.',
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Service supprimé.']);
    }
}
