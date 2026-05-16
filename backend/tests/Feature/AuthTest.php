<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_client_user_with_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test Client',
            'email' => 'test@example.com',
            'phone' => '+221770000000',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'device_name' => 'phpunit',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'test@example.com')
            ->assertJsonPath('data.role', 'client')
            ->assertJsonStructure(['token', 'pending_quotes_to_claim']);
    }

    public function test_register_does_not_auto_claim_guest_quotes(): void
    {
        // Sécurité : un user ne doit PAS récupérer automatiquement les devis
        // soumis avec son email en mode invité (anti vol de données).
        \App\Models\Quote::factory()->create([
            'client_email' => 'victim@example.com',
            'user_id' => null,
        ]);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Attacker',
            'email' => 'victim@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'device_name' => 'phpunit',
        ]);

        $response->assertCreated()
            ->assertJsonPath('pending_quotes_to_claim', 1);

        // Mais le devis reste user_id=null (pas claim automatique)
        $this->assertDatabaseHas('quotes', [
            'client_email' => 'victim@example.com',
            'user_id' => null,
        ]);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'user@lartiska.com',
            'password' => Hash::make('secret123'),
            'role' => 'client',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@lartiska.com',
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonStructure(['token']);
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'user@lartiska.com',
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@lartiska.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    }
}
