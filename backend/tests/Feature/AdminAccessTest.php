<?php

namespace Tests\Feature;

use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_cannot_access_admin_routes(): void
    {
        $this->getJson('/api/admin/dashboard')->assertUnauthorized();
        $this->getJson('/api/admin/quotes')->assertUnauthorized();
        $this->getJson('/api/admin/messages')->assertUnauthorized();
    }

    public function test_client_cannot_access_admin_routes(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($client);

        $this->getJson('/api/admin/dashboard')->assertForbidden();
        $this->getJson('/api/admin/quotes')->assertForbidden();
    }

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure(['data' => ['quotes', 'messages', 'projects']]);
    }

    public function test_admin_can_update_quote_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $quote = Quote::factory()->create(['status' => 'pending']);

        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/admin/quotes/{$quote->id}", [
            'status' => 'processing',
            'admin_notes' => 'En cours d\'étude',
        ]);

        $response->assertOk();
        $this->assertEquals('processing', $quote->fresh()->status);
    }

    public function test_client_cannot_respond_to_pending_quote(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $quote = Quote::factory()->create([
            'user_id' => $client->id,
            'status' => 'pending', // pas encore envoyé par l'admin
        ]);

        Sanctum::actingAs($client);

        $this->postJson("/api/account/quotes/{$quote->id}/respond", [
            'action' => 'accept',
        ])->assertStatus(422);
    }

    public function test_client_can_accept_sent_quote(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $quote = Quote::factory()->create([
            'user_id' => $client->id,
            'status' => 'sent',
        ]);

        Sanctum::actingAs($client);

        $this->postJson("/api/account/quotes/{$quote->id}/respond", [
            'action' => 'accept',
        ])->assertOk();

        $this->assertEquals('accepted', $quote->fresh()->status);
        $this->assertNotNull($quote->fresh()->accepted_at);
    }
}
