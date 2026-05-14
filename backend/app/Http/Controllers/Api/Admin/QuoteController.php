<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteStatusRequest;
use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Quote::with('service:id,title,unit')->latest();

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhere('client_email', 'like', "%{$search}%")
                  ->orWhere('client_phone', 'like', "%{$search}%");
            });
        }

        $quotes = $query->paginate(min($request->integer('per_page', 20), 100));

        return QuoteResource::collection($quotes);
    }

    public function show(Quote $quote): JsonResponse
    {
        return response()->json([
            'data' => new QuoteResource($quote->load(['service', 'items', 'user:id,name,email'])),
        ]);
    }

    public function update(UpdateQuoteStatusRequest $request, Quote $quote): JsonResponse
    {
        $data = $request->validated();

        if ($data['status'] === 'sent' && empty($quote->sent_at)) {
            $data['sent_at'] = now();
        }

        if ($data['status'] === 'accepted' && empty($quote->accepted_at)) {
            $data['accepted_at'] = now();
        }

        $quote->update($data);

        return response()->json([
            'data' => new QuoteResource($quote->fresh(['service'])),
            'message' => 'Statut du devis mis à jour.',
        ]);
    }
}
