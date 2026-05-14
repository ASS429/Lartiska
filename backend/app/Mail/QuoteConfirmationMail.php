<?php

namespace App\Mail;

use App\Models\Quote;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Mail\Mailables\Attachment;

class QuoteConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Quote $quote, public bool $withPdf = false)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Votre devis Lartiska — {$this->quote->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.quote-confirmation',
            with: [
                'quote' => $this->quote,
            ],
        );
    }

    /**
     * Attache le PDF du devis si disponible et demandé.
     */
    public function attachments(): array
    {
        if (!$this->withPdf || !$this->quote->pdf_path) {
            return [];
        }

        if (!Storage::disk('local')->exists($this->quote->pdf_path)) {
            return [];
        }

        return [
            Attachment::fromStorageDisk('local', $this->quote->pdf_path)
                ->as("Devis-{$this->quote->reference}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
