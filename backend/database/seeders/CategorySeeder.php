<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Peinture & fresques murales',
                'slug' => 'peinture-fresques',
                'icon' => 'brush',
                'description' => 'Peintures décoratives, fresques artistiques, trompe-l\'oeil et graffiti d\'intérieur.',
                'order' => 1,
            ],
            [
                'name' => 'Carrelage artistique',
                'slug' => 'carrelage',
                'icon' => 'grid',
                'description' => 'Pose et création de mosaïques, carrelages décoratifs, designs géométriques.',
                'order' => 2,
            ],
            [
                'name' => 'Plafonnage décoratif',
                'slug' => 'plafonnage',
                'icon' => 'ceiling',
                'description' => 'Faux plafonds, plâtrerie artistique, reliefs et textures.',
                'order' => 3,
            ],
            [
                'name' => 'Décoration & design d\'intérieur',
                'slug' => 'decoration',
                'icon' => 'sofa',
                'description' => 'Concepts visuels uniques pour les espaces résidentiels et commerciaux.',
                'order' => 4,
            ],
            [
                'name' => 'Epoxy résine & revêtement sol',
                'slug' => 'epoxy-resine',
                'icon' => 'shine',
                'description' => 'Sols et plans en résine epoxy haute brillance — finitions miroir, marbrées, métallisées. Résistance et durabilité pour résidentiel et commercial.',
                'order' => 5,
            ],
            [
                'name' => 'Commandes personnalisées',
                'slug' => 'sur-mesure',
                'icon' => 'sparkle',
                'description' => 'Créations sur-mesure adaptées aux souhaits spécifiques de chaque client.',
                'order' => 6,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
