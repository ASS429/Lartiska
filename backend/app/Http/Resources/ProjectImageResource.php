<?php

namespace App\Http\Resources;

use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => MediaUrl::absolute($this->path),
            'type' => $this->type ?? 'image',
            'before_after' => $this->before_after ?? 'none',
            'thumbnail' => MediaUrl::absolute($this->thumbnail),
            'caption' => $this->caption,
            'order' => $this->order,
            'is_cover' => $this->is_cover,
            'width' => $this->width,
            'height' => $this->height,
        ];
    }
}
