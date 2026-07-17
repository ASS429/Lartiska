<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UpdatePasswordTest extends TestCase
{
    use RefreshDatabase;

    private function makeUserWithToken(string $password = 'AncienMotDePasse1'): array
    {
        $user = User::factory()->create(['password' => Hash::make($password)]);
        $token = $user->createToken('session-a')->plainTextToken;

        return [$user, $token];
    }

    public function test_user_can_change_password_and_other_sessions_are_revoked(): void
    {
        [$user, $token] = $this->makeUserWithToken();
        $otherToken = $user->createToken('session-b')->plainTextToken;

        $this->withToken($token)
            ->patchJson('/api/auth/password', [
                'current_password' => 'AncienMotDePasse1',
                'password' => 'NouveauMotDePasse2',
                'password_confirmation' => 'NouveauMotDePasse2',
            ])
            ->assertOk();

        // Le nouveau mot de passe fonctionne
        $this->assertTrue(Hash::check('NouveauMotDePasse2', $user->fresh()->password));

        // La session courante survit, l'autre est révoquée.
        // (forgetGuards : Sanctum met en cache l'utilisateur résolu entre
        // deux requêtes du même test — on force la re-résolution du token.)
        $this->app->get('auth')->forgetGuards();
        $this->withToken($token)->getJson('/api/auth/me')->assertOk();

        $this->app->get('auth')->forgetGuards();
        $this->withToken($otherToken)->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_wrong_current_password_is_rejected(): void
    {
        [, $token] = $this->makeUserWithToken();

        $this->withToken($token)
            ->patchJson('/api/auth/password', [
                'current_password' => 'mauvais-mot-de-passe',
                'password' => 'NouveauMotDePasse2',
                'password_confirmation' => 'NouveauMotDePasse2',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_weak_new_password_is_rejected(): void
    {
        [, $token] = $this->makeUserWithToken();

        $this->withToken($token)
            ->patchJson('/api/auth/password', [
                'current_password' => 'AncienMotDePasse1',
                'password' => 'court1',
                'password_confirmation' => 'court1',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_guest_cannot_change_password(): void
    {
        $this->patchJson('/api/auth/password', [
            'current_password' => 'x',
            'password' => 'NouveauMotDePasse2',
            'password_confirmation' => 'NouveauMotDePasse2',
        ])->assertUnauthorized();
    }
}
