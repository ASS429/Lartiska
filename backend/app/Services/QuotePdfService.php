<?php

namespace App\Services;

use App\Models\Quote;
use App\Models\Setting;
use App\Support\PrivateStorage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class QuotePdfService
{
    /**
     * Génère (ou régénère) le PDF officiel d'un devis et le stocke en privé.
     * Retourne le chemin relatif (storage/app/private).
     */
    public function generate(Quote $quote): string
    {
        $quote->loadMissing(['service', 'items']);

        $settings = Setting::whereIn('key', [
            'company.name', 'company.tagline', 'company.essence',
            'contact.email', 'contact.address', 'contact.phones',
        ])->pluck('value', 'key')->all();

        $html = View::make('pdf.quote', [
            'quote' => $quote,
            'settings' => $settings,
            'generatedAt' => now(),
        ])->render();

        $pdf = Pdf::loadHTML($html)
            ->setPaper('A4')
            ->setOption(['defaultFont' => 'DejaVu Sans']);

        $relativePath = "quotes/{$quote->reference}.pdf";

        // Stockage PRIVÉ (local en dev, R2 privé en prod) — accessible
        // uniquement via QuoteController::downloadPdf (auth+owner check).
        PrivateStorage::put($relativePath, $pdf->output());

        $quote->update(['pdf_path' => $relativePath]);

        return $relativePath;
    }
}
