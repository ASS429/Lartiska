<?php

namespace App\Http\Resources;

use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_image' => MediaUrl::absolute($this->cover_image),
            'city' => $this->city,
            'client_name' => $this->client_name,
            'materials' => $this->materials,
            'duration' => $this->duration,
            'completed_at' => $this->completed_at?->toDateString(),
            'status' => $this->status,
            'featured' => $this->featured,
            'order' => $this->order,
            'images_count' => $this->whenCounted('images'),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ProjectImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
