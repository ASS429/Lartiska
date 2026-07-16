<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // Company
            ['key' => 'company.name', 'value' => 'Lartiska', 'group' => 'company', 'is_public' => true],
            ['key' => 'company.tagline', 'value' => 'L\'art qui transforme vos espaces', 'group' => 'company', 'is_public' => true],
            ['key' => 'company.essence', 'value' => 'émeraude · or · pièce signature', 'group' => 'company', 'is_public' => true],

            // 3 numéros de téléphone — chacun avec WhatsApp associé (vrais numéros Lartiska)
            ['key' => 'contact.phones', 'group' => 'contact', 'is_public' => true, 'value' => [
                ['label' => 'Tounkara — Atelier', 'phone' => '+221 78 544 63 63', 'whatsapp' => '221785446363'],
                ['label' => 'Devis & projets',    'phone' => '+221 77 346 86 81', 'whatsapp' => '221773468681'],
                ['label' => 'Service client',     'phone' => '+221 77 289 85 37', 'whatsapp' => '221772898537'],
            ]],

            // Email principal
            ['key' => 'contact.email', 'value' => 'contact@lartiska.com', 'group' => 'contact', 'is_public' => true],
            ['key' => 'contact.address', 'value' => 'Dakar, Sénégal', 'group' => 'contact', 'is_public' => true],

            // Réseaux sociaux — URLs officielles Lartiska (sans paramètres de tracking)
            ['key' => 'social.facebook',  'value' => 'https://www.facebook.com/share/1U5e5Kr13D/', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.instagram', 'value' => 'https://www.instagram.com/lartiska_officiel', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.tiktok',    'value' => 'https://www.tiktok.com/@lartiska', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.youtube',   'value' => 'https://www.youtube.com/@lartiska6323', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.snapchat',  'value' => 'https://www.snapchat.com/add/lartiska', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.gmail',     'value' => 'lartiska.officiel@gmail.com', 'group' => 'social', 'is_public' => true],

            // Identifiants courts pour affichage
            ['key' => 'social_handle.facebook',  'value' => 'Lartiska', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_handle.instagram', 'value' => '@lartiska_officiel', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_handle.tiktok',    'value' => '@lartiska', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_handle.youtube',   'value' => '@lartiska6323', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_handle.snapchat',  'value' => 'lartiska', 'group' => 'social', 'is_public' => true],

            // Villes desservies
            ['key' => 'cities.served', 'value' => ['Dakar', 'Thiès', 'Saint-Louis', 'Tivaoune', 'Touba', 'Ziguinchor', 'Banjul (Gambie)', 'Nouakchott (Mauritanie)'], 'group' => 'company', 'is_public' => true],
        ];

        foreach ($defaults as $row) {
            // Nettoie la structure pour la table : si 'value' est un tableau d'objets, on l'enregistre tel quel.
            Setting::updateOrCreate(
                ['key' => $row['key']],
                [
                    'value' => $row['value'],
                    'group' => $row['group'],
                    'is_public' => $row['is_public'] ?? false,
                ]
            );
        }
    }
}
