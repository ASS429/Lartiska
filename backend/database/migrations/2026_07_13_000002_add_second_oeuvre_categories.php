<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

/**
 * Second volet de l'élargissement des métiers (texte officiel Lartiska :
 * « une entreprise qui œuvre sur le second œuvre ») : menuiserie,
 * ameublement, espaces verts, étanchéité.
 * Upsert par slug — idempotente, tourne seule en prod.
 */
return new class extends Migration
{
    private const CATEGORIES = [
        [
            'name' => 'Menuiserie',
            'slug' => 'menuiserie',
            'icon' => 'wood',
            'description' => 'Menuiserie bois et aluminium : portes, fenêtres, placards, habillages sur mesure.',
            'order' => 12,
        ],
        [
            'name' => 'Ameublement sur mesure',
            'slug' => 'ameublement',
            'icon' => 'furniture',
            'description' => 'Meubles dessinés et fabriqués pour votre espace — dressing, bibliothèques, mobilier signature.',
            'order' => 13,
        ],
        [
            'name' => 'Espaces verts & paysagisme',
            'slug' => 'espaces-verts',
            'icon' => 'leaf',
            'description' => 'Création et aménagement de jardins, terrasses végétalisées et espaces extérieurs.',
            'order' => 14,
        ],
        [
            'name' => 'Étanchéité',
            'slug' => 'etancheite',
            'icon' => 'droplet',
            'description' => 'Étanchéité des toitures-terrasses, salles d\'eau et façades — protection durable contre les infiltrations.',
            'order' => 15,
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
