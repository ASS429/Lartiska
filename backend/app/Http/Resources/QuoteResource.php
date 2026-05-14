<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isAdmin = $user?->isAdmin() === true;

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
            'has_pdf' => !empty($this->pdf_path),
            'pdf_download_url' => $this->pdf_path
                ? route('quotes.pdf', $this->resource)
                : null,
            'attachments_count' => is_array($this->attachments) ? count($this->attachments) : 0,
            'sent_at' => $this->sent_at?->toIso8601String(),
            'accepted_at' => $this->accepted_at?->toIso8601String(),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($i) => [
                'id' => $i->id,
                'description' => $i->description,
                'quantity' => (float) $i->quantity,
                'unit' => $i->unit,
                'unit_price' => (float) $i->unit_price,
                'total' => (float) $i->total,
                'order' => $i->order,
            ])),
            'admin_notes' => $isAdmin ? $this->admin_notes : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
