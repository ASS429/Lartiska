<?php

namespace App\Http\Resources;

use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_name' => $this->client_name,
            'client_role' => $this->client_role,
            'city' => $this->city,
            'content' => $this->content,
            'rating' => $this->rating,
            'avatar' => MediaUrl::absolute($this->avatar),
            'is_published' => $this->is_published,
            'order' => $this->order,
            'project' => $this->whenLoaded('project', fn () => [
                'id' => $this->project->id,
                'title' => $this->project->title,
                'slug' => $this->project->slug,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
