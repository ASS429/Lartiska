<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // En local : valeur par défaut "lartiska2026" pour démarrer rapidement.
        // En production : DOIT être défini via ADMIN_DEFAULT_PASSWORD dans Railway.
        // Si absent en prod, on génère un mot de passe aléatoire qu'on log (le user devra
        // lire les logs ou réinitialiser via tinker pour récupérer l'accès).
        $envPassword = env('ADMIN_DEFAULT_PASSWORD');

        if (!$envPassword && app()->environment('production')) {
            $envPassword = Str::random(24);
            $this->command?->warn("⚠ ADMIN_DEFAULT_PASSWORD non défini. Mot de passe généré : {$envPassword}");
            $this->command?->warn("⚠ Copie-le maintenant — il ne sera plus affiché.");
        }

        $password = $envPassword ?: 'lartiska2026';

        $email = env('ADMIN_DEFAULT_EMAIL', 'tounkara@lartiska.com');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_DEFAULT_NAME', 'Tounkara'),
                'password' => Hash::make($password),
                'role' => 'admin',
                'phone' => env('ADMIN_DEFAULT_PHONE', '+221785446363'),
                'email_verified_at' => now(),
            ],
        );
    }
}
