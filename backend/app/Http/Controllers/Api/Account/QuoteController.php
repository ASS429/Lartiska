<?php

namespace App\Http\Controllers\Api\Account;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $quotes = $request->user()
            ->quotes()
            ->with('service:id,title,unit')
            ->latest()
            ->paginate(15);

        return QuoteResource::collection($quotes);
    }

    public function show(Request $request, Quote $quote): JsonResponse
    {
        $this->authorizeOwnership($request, $quote);

        return response()->json([
            'data' => new QuoteResource($quote->load(['service', 'items'])),
        ]);
    }

    /**
     * Le client répond à un devis envoyé : accept / reject / request_changes.
     */
    public function respond(Request $request, Quote $quote): JsonResponse
    {
        $this->authorizeOwnership($request, $quote);

        $validated = $request->validate([
            'action' => ['required', Rule::in(['accept', 'reject', 'request_changes'])],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        // Un client ne peut répondre que si le devis a été envoyé (status=sent)
        if ($quote->status !== 'sent') {
            return response()->json([
                'message' => 'Ce devis n\'est pas encore prêt à être validé.',
            ], 422);
        }

        $previousStatus = $quote->status;

        switch ($validated['action']) {
            case 'accept':
                $quote->update([
                    'status' => 'accepted',
                    'accepted_at' => now(),
                ]);
                break;

            case 'reject':
                $quote->update(['status' => 'rejected']);
                break;

            case 'request_changes':
                // Garde le statut sent, ajoute juste la note + active la revue admin
                $quote->update([
                    'status' => 'processing',
                    'admin_notes' => trim(($quote->admin_notes . "\n\n[Modif demandée par " . $request->user()->name
                        . " le " . now()->format('d/m/Y H:i') . "]\n" . ($validated['comment'] ?? '—'))),
                ]);
                break;
        }

        ActivityLogger::log("quote.client_{$validated['action']}", $quote, [
            'from' => $previousStatus,
            'to' => $quote->status,
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'data' => new QuoteResource($quote->fresh(['service', 'items'])),
            'message' => match ($validated['action']) {
                'accept' => 'Devis accepté. Tounkara vous contactera pour la suite.',
                'reject' => 'Devis refusé.',
                'request_changes' => 'Demande de modification envoyée.',
            },
        ]);
    }

    private function authorizeOwnership(Request $request, Quote $quote): void
    {
        if ($quote->user_id !== $request->user()->id) {
            abort(403, 'Vous n\'avez pas accès à ce devis.');
        }
    }
}
