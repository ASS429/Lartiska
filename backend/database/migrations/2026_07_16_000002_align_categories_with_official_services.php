<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

/**
 * Alignement avec la liste officielle des services communiquée par
 * Lartiska : peinture, carrelage, plafonnage (plâtre, BA13), étanchéité,
 * menuiserie (portes, cuisine américaine, meubles TV…), aluminium
 * (portes, fenêtres…) et cuvelage.
 *
 * → Ajoute "aluminium" et "cuvelage" (manquants), précise les
 *   descriptions de "plafonnage" et "menuiserie". Idempotente.
 */
return new class extends Migration
{
    private const NEW_CATEGORIES = [
        [
            'name' => 'Aluminium',
            'slug' => 'aluminium',
            'icon' => 'window',
            'description' => 'Menuiserie aluminium : portes, fenêtres, baies vitrées et vérandas sur mesure.',
            'order' => 16,
        ],
        [
            'name' => 'Cuvelage',
            'slug' => 'cuvelage',
            'icon' => 'droplet-shield',
            'description' => 'Traitement étanche des sous-sols, caves, fosses et réservoirs contre les infiltrations d\'eau.',
            'order' => 17,
        ],
    ];

    private const UPDATED_DESCRIPTIONS = [
        'plafonnage' => 'Plafonnage plâtre et BA13 : faux plafonds, plâtrerie artistique, reliefs et textures.',
        'menuiserie' => 'Menuiserie bois : portes, cuisines américaines, meubles TV standards et mobilier sur mesure.',
    ];

    public function up(): void
    {
        foreach (self::NEW_CATEGORIES as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        foreach (self::UPDATED_DESCRIPTIONS as $slug => $description) {
            Category::where('slug', $slug)->update(['description' => $description]);
        }
    }

    public function down(): void
    {
        Category::whereIn('slug', array_column(self::NEW_CATEGORIES, 'slug'))
            ->whereDoesntHave('services')
            ->whereDoesntHave('projects')
            ->delete();
    }
};
