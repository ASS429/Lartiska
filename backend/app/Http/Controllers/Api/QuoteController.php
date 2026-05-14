<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequest;
use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuoteController extends Controller
{
    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;

        // Pieces jointes : disque PRIVÉ (jamais expose publiquement les photos
        // d'intérieur / adresses / contrats des clients)
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('quotes/' . now()->format('Y/m'), 'local');
            }
        }
        $data['attachments'] = $attachments ?: null;

        $quote = Quote::create($data);

        return response()->json([
            'data' => new QuoteResource($quote->load('service')),
            'message' => 'Demande envoyée. Tounkara reviendra vers vous très vite.',
        ], 201);
    }

    public function show(Request $request, Quote $quote): JsonResponse
    {
        $this->authorizeAccess($request, $quote);

        return response()->json([
            'data' => new QuoteResource($quote->load(['service', 'items'])),
        ]);
    }

    public function downloadPdf(Request $request, Quote $quote)
    {
        $this->authorizeAccess($request, $quote);

        if (!$quote->pdf_path || !Storage::disk('local')->exists($quote->pdf_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($quote->pdf_path, "{$quote->reference}.pdf");
    }

    /**
     * Un devis n'est lisible que par son propriétaire (user_id) ou par un admin.
     * Les devis créés en invité (user_id null) ne sont accessibles que par les admins.
     */
    private function authorizeAccess(Request $request, Quote $quote): void
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->isAdmin()) {
            return;
        }

        if ($quote->user_id === null || $quote->user_id !== $user->id) {
            abort(403, 'Vous n\'avez pas accès à ce devis.');
        }
    }
}
