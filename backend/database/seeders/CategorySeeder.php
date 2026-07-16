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
                'description' => 'Plafonnage plâtre et BA13 : faux plafonds, plâtrerie artistique, reliefs et textures.',
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
            // ── Élargissement des métiers (2026) ──────────────────────
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
            // ── Second œuvre (texte officiel Lartiska) ─────────────────
            [
                'name' => 'Menuiserie',
                'slug' => 'menuiserie',
                'icon' => 'wood',
                'description' => 'Menuiserie bois : portes, cuisines américaines, meubles TV standards et mobilier sur mesure.',
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

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
