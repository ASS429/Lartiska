<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

/**
 * Pose les liens réseaux sociaux OFFICIELS de Lartiska (fournis par
 * l'entreprise, nettoyés des paramètres de tracking) + ajoute YouTube.
 *
 * Migration de données idempotente : écrase les valeurs placeholder du
 * seed initial en production (RUN_SEED=false, le seeder n'y tourne plus).
 * L'admin garde la main : toute modification ultérieure via l'écran
 * Réglages est conservée (cette migration ne tourne qu'une fois).
 */
return new class extends Migration
{
    private const SETTINGS = [
        ['key' => 'social.facebook',  'value' => 'https://www.facebook.com/share/1U5e5Kr13D/'],
        ['key' => 'social.instagram', 'value' => 'https://www.instagram.com/lartiska_officiel'],
        ['key' => 'social.tiktok',    'value' => 'https://www.tiktok.com/@lartiska'],
        ['key' => 'social.youtube',   'value' => 'https://www.youtube.com/@lartiska6323'],
        ['key' => 'social_handle.facebook',  'value' => 'Lartiska'],
        ['key' => 'social_handle.instagram', 'value' => '@lartiska_officiel'],
        ['key' => 'social_handle.tiktok',    'value' => '@lartiska'],
        ['key' => 'social_handle.youtube',   'value' => '@lartiska6323'],
    ];

    public function up(): void
    {
        foreach (self::SETTINGS as $row) {
            Setting::updateOrCreate(
                ['key' => $row['key']],
                ['value' => $row['value'], 'group' => 'social', 'is_public' => true],
            );
        }
    }

    public function down(): void
    {
        // Pas de retour en arrière : ce sont les liens officiels.
    }
};
