<?php

namespace App\Mail;

use App\Models\Quote;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewQuoteAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Quote $quote)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nouvelle demande de devis — {$this->quote->reference} ({$this->quote->client_name})",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.new-quote-admin',
            with: [
                'quote' => $this->quote,
            ],
        );
    }
}
