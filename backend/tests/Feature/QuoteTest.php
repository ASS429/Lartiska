<?php

namespace Tests\Feature;

use App\Models\Quote;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class QuoteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // On a besoin de catégories + services pour créer un devis
        $this->seed([CategorySeeder::class, ServiceSeeder::class]);
    }

    public function test_guest_can_submit_quote(): void
    {
        $response = $this->postJson('/api/quotes', [
            'service_id' => \App\Models\Service::first()->id,
            'client_name' => 'Guest User',
            'client_email' => 'guest@example.com',
            'client_phone' => '+221770000000',
            'description' => 'Test de demande de devis en mode invité',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.client_name', 'Guest User')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('quotes', [
            'client_email' => 'guest@example.com',
            'user_id' => null,
        ]);
    }

    public function test_authenticated_client_quote_is_associated_with_user(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($client);

        $response = $this->postJson('/api/quotes', [
            'service_id' => \App\Models\Service::first()->id,
            'client_name' => $client->name,
            'client_email' => $client->email,
            'client_phone' => '+221770000001',
            'description' => 'Devis du client authentifié',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('quotes', [
            'client_email' => $client->email,
            'user_id' => $client->id,
        ]);
    }

    public function test_client_cannot_see_quote_of_another_user(): void
    {
        $alice = User::factory()->create(['role' => 'client']);
        $bob = User::factory()->create(['role' => 'client']);
        $bobQuote = Quote::factory()->create(['user_id' => $bob->id]);

        Sanctum::actingAs($alice);

        $this->getJson("/api/quotes/{$bobQuote->id}")->assertForbidden();
    }

    public function test_client_can_see_own_quote(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $quote = Quote::factory()->create(['user_id' => $client->id]);

        Sanctum::actingAs($client);

        $this->getJson("/api/quotes/{$quote->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $quote->id);
    }

    public function test_admin_can_see_any_quote(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $someQuote = Quote::factory()->create(['user_id' => null]);

        Sanctum::actingAs($admin);

        $this->getJson("/api/quotes/{$someQuote->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $someQuote->id);
    }
}
