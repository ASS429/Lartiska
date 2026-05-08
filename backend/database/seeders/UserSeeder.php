<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'tounkara@lartiska.com'],
            [
                'name' => 'Tounkara',
                'password' => Hash::make('lartiska2026'),
                'role' => 'admin',
                'phone' => '+221785446363',
                'email_verified_at' => now(),
            ],
        );
    }
}
