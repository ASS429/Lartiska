<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'client_name' => $this->client_name,
            'client_email' => $this->client_email,
            'client_phone' => $this->client_phone,
            'client_city' => $this->client_city,
            'site_address' => $this->site_address,
            'description' => $this->description,
            'surface_m2' => $this->surface_m2 ? (float) $this->surface_m2 : null,
            'estimated_budget' => $this->estimated_budget ? (float) $this->estimated_budget : null,
            'total_amount' => $this->total_amount ? (float) $this->total_amount : null,
            'status' => $this->status,
            'service' => new ServiceResource($this->whenLoaded('service')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
