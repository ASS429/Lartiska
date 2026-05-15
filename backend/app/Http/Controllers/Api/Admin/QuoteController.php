<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteStatusRequest;
use App\Http\Resources\QuoteResource;
use App\Mail\QuoteConfirmationMail;
use App\Models\Quote;
use App\Services\ActivityLogger;
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

        $previousStatus = $quote->getOriginal('status');
        $quote->update($data);

        if ($previousStatus !== $quote->status) {
            ActivityLogger::log('quote.status_changed', $quote, [
                'from' => $previousStatus,
                'to' => $quote->status,
            ]);
        }

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
        ActivityLogger::log('quote.pdf_generated', $quote);

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

        ActivityLogger::log('quote.sent_to_client', $quote, [
            'recipient' => $quote->client_email,
        ]);

        return response()->json([
            'data' => new QuoteResource($quote->fresh(['service', 'items'])),
            'message' => 'Devis envoyé au client.',
        ]);
    }

    /**
     * Export CSV des devis (respect des filtres status/search).
     */
    public function export(Request $request)
    {
        $query = Quote::with('service:id,title')->latest();

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhere('client_email', 'like', "%{$search}%");
            });
        }

        $filename = 'devis-lartiska-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($query) {
            $out = fopen('php://output', 'w');
            // BOM UTF-8 pour Excel
            fputs($out, "\xEF\xBB\xBF");

            fputcsv($out, [
                'Référence', 'Date', 'Client', 'Email', 'Téléphone',
                'Ville', 'Service', 'Surface (m²)', 'Budget annoncé (FCFA)',
                'Montant final (FCFA)', 'Statut', 'Envoyé le', 'Accepté le',
            ], ';');

            $query->chunk(200, function ($quotes) use ($out) {
                foreach ($quotes as $q) {
                    fputcsv($out, [
                        $q->reference,
                        $q->created_at?->format('d/m/Y H:i'),
                        $q->client_name,
                        $q->client_email,
                        $q->client_phone,
                        $q->client_city,
                        $q->service?->title,
                        $q->surface_m2,
                        $q->estimated_budget,
                        $q->total_amount,
                        $q->status,
                        $q->sent_at?->format('d/m/Y H:i'),
                        $q->accepted_at?->format('d/m/Y H:i'),
                    ], ';');
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
