<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

/**
 * La redirection téléphone/WhatsApp du site passe du numéro d'Ahmadou
 * (785446363) à celui de Malick (773468681) — demande Lartiska.
 *
 *  - contact.whatsapp : clé pilote du bouton WhatsApp flottant et du
 *    bloc « canaux directs » de la page devis ;
 *  - contact.phones : Malick devient la première entrée (elle pilote le
 *    QR code et le lien principal de la page Contact) — les autres
 *    numéros existants sont conservés à leur suite.
 *
 * Idempotente ; l'admin garde la main via Réglages ensuite.
 */
return new class extends Migration
{
    private const MALICK = [
        'label' => 'Malick — Devis & contact',
        'phone' => '+221 77 346 86 81',
        'whatsapp' => '221773468681',
    ];

    public function up(): void
    {
        Setting::updateOrCreate(
            ['key' => 'contact.whatsapp'],
            ['value' => self::MALICK['whatsapp'], 'group' => 'contact', 'is_public' => true],
        );

        $phones = Setting::where('key', 'contact.phones')->first()?->value;
        $phones = is_array($phones) ? $phones : [];

        // Retirer une éventuelle entrée Malick existante puis le placer en tête.
        $phones = array_values(array_filter(
            $phones,
            fn ($p) => ($p['whatsapp'] ?? null) !== self::MALICK['whatsapp'],
        ));
        array_unshift($phones, self::MALICK);

        Setting::updateOrCreate(
            ['key' => 'contact.phones'],
            ['value' => $phones, 'group' => 'contact', 'is_public' => true],
        );
    }

    public function down(): void
    {
        // Pas de retour automatique : réglable via l'admin.
    }
};
