<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteStatusRequest;
use App\Http\Resources\QuoteResource;
use App\Mail\QuoteConfirmationMail;
use App\Models\Quote;
use App\Services\QuotePdfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

    /**
     * (Re)génère le PDF officiel du devis.
     */
    public function generatePdf(Quote $quote, QuotePdfService $pdfService): JsonResponse
    {
        $pdfService->generate($quote);

        return response()->json([
            'data' => new QuoteResource($quote->fresh(['service', 'items'])),
            'message' => 'PDF généré.',
        ]);
    }

    /**
     * Envoie le devis au client par email (avec PDF en pièce jointe).
     * Génère le PDF s'il n'existe pas encore. Passe le statut à "sent".
     */
    public function sendToClient(Quote $quote, QuotePdfService $pdfService): JsonResponse
    {
        if (!$quote->pdf_path) {
            $pdfService->generate($quote);
            $quote->refresh();
        }

        try {
            Mail::to($quote->client_email)
                ->send(new QuoteConfirmationMail($quote, withPdf: true));
        } catch (\Throwable $e) {
            Log::error('Quote email send failed', [
                'quote_id' => $quote->id,
                'reference' => $quote->reference,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Erreur lors de l\'envoi du mail : ' . $e->getMessage(),
            ], 500);
        }

        $quote->update([
            'status' => 'sent',
            'sent_at' => $quote->sent_at ?? now(),
        ]);

        return response()->json([
            'data' => new QuoteResource($quote->fresh(['service', 'items'])),
            'message' => 'Devis envoyé au client.',
        ]);
    }
}
