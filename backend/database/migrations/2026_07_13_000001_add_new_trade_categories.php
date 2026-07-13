<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

/**
 * Lartiska élargit ses métiers : maçonnerie, charpente, couverture,
 * façade & plâtrerie, isolation. (Peinture et carrelage existent déjà.)
 *
 * Migration de données (pas de schéma) : upsert par slug — idempotente,
 * ne touche pas aux catégories existantes ni à leurs services.
 * En prod, elle tourne toute seule via `php artisan migrate --force`.
 */
return new class extends Migration
{
    private const CATEGORIES = [
        [
            'name' => 'Maçonnerie & gros œuvre',
            'slug' => 'maconnerie',
            'icon' => 'wall',
            'description' => 'Construction, extension, murs et dalles — des fondations saines pour recevoir la finition.',
            'order' => 7,
        ],
        [
            'name' => 'Charpente',
            'slug' => 'charpente',
            'icon' => 'roof-frame',
            'description' => 'Charpentes bois et métalliques, ossatures et structures de toiture sur mesure.',
            'order' => 8,
        ],
        [
            'name' => 'Couverture & toiture',
            'slug' => 'couverture',
            'icon' => 'roof',
            'description' => 'Pose et rénovation de toitures : tuiles, tôles, bacs acier, étanchéité.',
            'order' => 9,
        ],
        [
            'name' => 'Façade & plâtrerie',
            'slug' => 'facade-platrerie',
            'icon' => 'facade',
            'description' => 'Ravalement de façades, enduits décoratifs, plâtrerie fine intérieure et extérieure.',
            'order' => 10,
        ],
        [
            'name' => 'Isolation',
            'slug' => 'isolation',
            'icon' => 'shield',
            'description' => 'Isolation thermique et phonique — confort durable et économies d\'énergie.',
            'order' => 11,
        ],
    ];

    public function up(): void
    {
        foreach (self::CATEGORIES as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }

    public function down(): void
    {
        Category::whereIn('slug', array_column(self::CATEGORIES, 'slug'))
            ->whereDoesntHave('services')
            ->whereDoesntHave('projects')
            ->delete();
    }
};
