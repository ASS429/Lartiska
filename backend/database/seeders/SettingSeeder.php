<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['key' => 'company.name', 'value' => 'Lartiska', 'group' => 'company', 'is_public' => true],
            ['key' => 'company.tagline', 'value' => 'L\'art qui transforme vos espaces', 'group' => 'company', 'is_public' => true],
            ['key' => 'contact.phone', 'value' => '+221785446363', 'group' => 'contact', 'is_public' => true],
            ['key' => 'contact.whatsapp', 'value' => '221785446363', 'group' => 'contact', 'is_public' => true],
            ['key' => 'contact.email', 'value' => 'contact@lartiska.com', 'group' => 'contact', 'is_public' => true],
            ['key' => 'contact.address', 'value' => 'Dakar, Sénégal', 'group' => 'contact', 'is_public' => true],
            ['key' => 'social.instagram', 'value' => 'https://instagram.com/lartiska_officiel', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.tiktok', 'value' => 'https://www.tiktok.com/@lartiska', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.facebook', 'value' => '', 'group' => 'social', 'is_public' => true],
            ['key' => 'social.snapchat', 'value' => '', 'group' => 'social', 'is_public' => true],
            ['key' => 'cities.served', 'value' => ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour', 'Banjul', 'Nouakchott'], 'group' => 'company', 'is_public' => true],
        ];

        foreach ($defaults as $row) {
            Setting::updateOrCreate(['key' => $row['key']], $row);
        }
    }
}
