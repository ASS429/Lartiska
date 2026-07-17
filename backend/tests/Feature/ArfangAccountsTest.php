<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Les comptes créés par la migration 2026_07_16_000003 doivent pouvoir
 * se connecter avec le mot de passe convenu (hash bcrypt coût 12 écrit
 * via Query Builder — indépendant de BCRYPT_ROUNDS de l'environnement).
 */
class ArfangAccountsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_account_can_login_and_access_admin(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'arfang@lartiska.com',
            'password' => 'lartiska2026',
            'device_name' => 'test',
        ]);

        $response->assertOk()->assertJsonPath('data.role', 'admin');

        $token = $response->json('token');
        $this->withToken($token)
            ->getJson('/api/admin/dashboard')
            ->assertOk();
    }

    public function test_client_account_can_login_but_not_access_admin(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'arfang@lartiska.sn',
            'password' => 'lartiska2026',
            'device_name' => 'test',
        ]);

        $response->assertOk()->assertJsonPath('data.role', 'client');

        $token = $response->json('token');
        $this->withToken($token)
            ->getJson('/api/admin/dashboard')
            ->assertForbidden();
    }
}
