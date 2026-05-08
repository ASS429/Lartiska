<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $bySlug = Category::pluck('id', 'slug');

        $services = [
            [
                'category' => 'peinture-fresques',
                'title' => 'Fresque murale personnalisée',
                'description' => 'Création d\'une fresque artistique sur-mesure, intérieur ou extérieur.',
                'price_from' => 25000,
                'price_to' => 80000,
                'unit' => 'm2',
                'order' => 1,
            ],
            [
                'category' => 'peinture-fresques',
                'title' => 'Peinture décorative classique',
                'description' => 'Peinture intérieure premium, finition mate, satinée ou laquée.',
                'price_from' => 4500,
                'price_to' => 9000,
                'unit' => 'm2',
                'order' => 2,
            ],
            [
                'category' => 'carrelage',
                'title' => 'Pose de carrelage standard',
                'description' => 'Pose professionnelle de carrelage sol ou mur (matériaux non inclus).',
                'price_from' => 6000,
                'price_to' => 12000,
                'unit' => 'm2',
                'order' => 1,
            ],
            [
                'category' => 'carrelage',
                'title' => 'Mosaïque artistique sur-mesure',
                'description' => 'Création de mosaïques uniques, motifs personnalisés.',
                'price_from' => 35000,
                'price_to' => 120000,
                'unit' => 'm2',
                'order' => 2,
            ],
            [
                'category' => 'plafonnage',
                'title' => 'Faux plafond décoratif',
                'description' => 'Conception et pose de faux plafonds en BA13 ou staff, avec corniches.',
                'price_from' => 8000,
                'price_to' => 18000,
                'unit' => 'm2',
                'order' => 1,
            ],
            [
                'category' => 'decoration',
                'title' => 'Conception d\'espace complète',
                'description' => 'Plan déco, choix matériaux, mise en oeuvre. Forfait par pièce.',
                'price_from' => 250000,
                'price_to' => 1500000,
                'unit' => 'forfait',
                'order' => 1,
            ],
            [
                'category' => 'sur-mesure',
                'title' => 'Création artistique sur-mesure',
                'description' => 'Tarif sur étude. Sculpture, tableau, installation, objet unique.',
                'price_from' => null,
                'price_to' => null,
                'unit' => 'forfait',
                'order' => 1,
            ],
        ];

        foreach ($services as $svc) {
            $categoryId = $bySlug[$svc['category']] ?? null;
            if (!$categoryId) {
                continue;
            }
            unset($svc['category']);
            Service::updateOrCreate(
                ['title' => $svc['title']],
                array_merge($svc, ['category_id' => $categoryId, 'is_active' => true]),
            );
        }
    }
}
