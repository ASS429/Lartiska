<?php

namespace Tests\Feature;

use Database\Seeders\CategorySeeder;
use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Le champ honeypot "website" est invisible pour un humain : s'il est
 * rempli, c'est un bot. On renvoie un FAUX succès (le bot ne doit pas
 * apprendre qu'il est détecté) mais rien n'est stocké en base.
 */
class HoneypotTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([CategorySeeder::class, ServiceSeeder::class]);
    }

    public function test_quote_with_filled_honeypot_is_silently_dropped(): void
    {
        $response = $this->postJson('/api/quotes', [
            'service_id' => \App\Models\Service::first()->id,
            'client_name' => 'Bot Spammer',
            'client_email' => 'bot@spam.example',
            'client_phone' => '+221770000000',
            'description' => 'Contenu de spam automatisé pour test',
            'website' => 'https://spam.example', // ← honeypot rempli
        ]);

        // Faux succès : même statut qu'une vraie soumission
        $response->assertCreated();

        // …mais rien en base
        $this->assertDatabaseMissing('quotes', [
            'client_email' => 'bot@spam.example',
        ]);
    }

    public function test_contact_with_filled_honeypot_is_silently_dropped(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Bot Spammer',
            'email' => 'bot@spam.example',
            'subject' => 'Spam',
            'body' => 'Contenu de spam automatisé pour test',
            'website' => 'https://spam.example',
        ]);

        $response->assertCreated();

        $this->assertDatabaseMissing('messages', [
            'email' => 'bot@spam.example',
        ]);
    }

    public function test_legitimate_quote_without_honeypot_is_stored(): void
    {
        $response = $this->postJson('/api/quotes', [
            'service_id' => \App\Models\Service::first()->id,
            'client_name' => 'Vrai Client',
            'client_email' => 'client@example.com',
            'client_phone' => '+221770000000',
            'description' => 'Vraie demande de devis pour mon salon',
            // pas de champ website → humain
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('quotes', [
            'client_email' => 'client@example.com',
        ]);
    }
}
