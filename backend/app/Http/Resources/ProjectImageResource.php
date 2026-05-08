<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => Storage::url($this->path),
            'caption' => $this->caption,
            'order' => $this->order,
            'is_cover' => $this->is_cover,
            'width' => $this->width,
            'height' => $this->height,
        ];
    }
}
