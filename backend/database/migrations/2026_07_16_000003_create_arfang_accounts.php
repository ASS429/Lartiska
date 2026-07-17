<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;

/**
 * Comptes demandés par Arfang (mot de passe admin d'origine oublié) :
 *  - un compte ADMIN  : arfang@lartiska.com
 *  - un compte CLIENT : arfang@lartiska.sn
 *
 * Seul le hash bcrypt figure ici (jamais le mot de passe en clair dans
 * le repo). Idempotente : upsert par email — si le mot de passe est
 * changé ensuite via l'application, cette migration ne re-tournera pas.
 *
 * NB : le cast 'hashed' du modèle User ne re-hash pas une valeur déjà
 * hashée (Hash::isHashed), on peut donc passer le hash directement.
 */
return new class extends Migration
{
    private const HASH = '$2y$12$o3.glC/DpjoEUTpKyjsek.tGnY2U/JgmfyoE74v7qr/hBmrAs0XAe';

    public function up(): void
    {
        // NB : pas d'email_verified_at — le champ n'est pas fillable et la
        // connexion ne requiert pas d'email vérifié (pas de MustVerifyEmail).
        User::updateOrCreate(
            ['email' => 'arfang@lartiska.com'],
            [
                'name' => 'Arfang Souleymane Sané',
                'password' => self::HASH,
                'role' => 'admin',
            ],
        );

        User::updateOrCreate(
            ['email' => 'arfang@lartiska.sn'],
            [
                'name' => 'Arfang Sané (client test)',
                'password' => self::HASH,
                'role' => 'client',
            ],
        );
    }

    public function down(): void
    {
        User::whereIn('email', ['arfang@lartiska.com', 'arfang@lartiska.sn'])->delete();
    }
};
