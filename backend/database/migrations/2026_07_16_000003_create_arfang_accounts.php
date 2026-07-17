<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Comptes demandés par Arfang (mot de passe admin d'origine oublié) :
 *  - un compte ADMIN  : arfang@lartiska.com
 *  - un compte CLIENT : arfang@lartiska.sn
 *
 * Seul le hash bcrypt figure ici (jamais le mot de passe en clair dans
 * le repo). Idempotente : upsert par email.
 *
 * On passe par le Query Builder (pas Eloquent) : le cast 'hashed' du
 * modèle User vérifie que le coût du hash correspond à la config de
 * l'environnement (BCRYPT_ROUNDS=4 en tests vs 12 en prod) et jetterait
 * une RuntimeException. Le builder écrit le hash tel quel, partout.
 */
return new class extends Migration
{
    private const HASH = '$2y$12$o3.glC/DpjoEUTpKyjsek.tGnY2U/JgmfyoE74v7qr/hBmrAs0XAe';

    public function up(): void
    {
        $now = now();

        DB::table('users')->updateOrInsert(
            ['email' => 'arfang@lartiska.com'],
            [
                'name' => 'Arfang Souleymane Sané',
                'password' => self::HASH,
                'role' => 'admin',
                'updated_at' => $now,
                'created_at' => $now,
            ],
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'arfang@lartiska.sn'],
            [
                'name' => 'Arfang Sané (client test)',
                'password' => self::HASH,
                'role' => 'client',
                'updated_at' => $now,
                'created_at' => $now,
            ],
        );
    }

    public function down(): void
    {
        DB::table('users')->whereIn('email', ['arfang@lartiska.com', 'arfang@lartiska.sn'])->delete();
    }
};
