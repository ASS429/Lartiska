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

        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('quotes/uploads', 'public');
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
        if ($request->user()?->id !== $quote->user_id && !$request->user()?->isAdmin()) {
            abort(403);
        }

        return response()->json([
            'data' => new QuoteResource($quote->load(['service', 'items'])),
        ]);
    }

    public function downloadPdf(Quote $quote)
    {
        if (!$quote->pdf_path || !Storage::disk('local')->exists($quote->pdf_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($quote->pdf_path, "{$quote->reference}.pdf");
    }
}
