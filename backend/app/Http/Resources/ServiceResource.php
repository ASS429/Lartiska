<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price_from' => $this->price_from ? (float) $this->price_from : null,
            'price_to' => $this->price_to ? (float) $this->price_to : null,
            'unit' => $this->unit,
            'icon' => $this->icon,
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
