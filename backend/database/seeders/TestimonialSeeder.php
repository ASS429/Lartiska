<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::pluck('id', 'city');

        $rows = [
            [
                'client_name' => 'Aïssatou Diop',
                'client_role' => 'Maître d\'ouvrage',
                'city' => 'Dakar',
                'project_city' => 'Dakar',
                'rating' => 5,
                'content' => 'Tounkara a métamorphosé la villa familiale. Chaque mur raconte aujourd\'hui une histoire — l\'or à la feuille capte la lumière du soir et fait littéralement vibrer la pièce. Travail d\'orfèvre.',
                'order' => 1,
            ],
            [
                'client_name' => 'Mamadou Sarr',
                'client_role' => 'Hôtelier',
                'city' => 'Saint-Louis',
                'project_city' => 'Saint-Louis',
                'rating' => 5,
                'content' => 'La mosaïque de la réception est devenue notre signature. Les clients la photographient en arrivant. Lartiska a saisi notre âme et l\'a posée au sol.',
                'order' => 2,
            ],
            [
                'client_name' => 'Khadija Ba',
                'client_role' => 'Architecte d\'intérieur',
                'city' => 'Thiès',
                'project_city' => 'Thiès',
                'rating' => 5,
                'content' => 'Travailler avec Lartiska, c\'est entrer dans un atelier d\'artistes — pas un chantier. Le plafond est exactement ce que nous avions imaginé, en mieux.',
                'order' => 3,
            ],
            [
                'client_name' => 'Moustapha Tall',
                'client_role' => 'Promoteur',
                'city' => 'Touba',
                'project_city' => 'Touba',
                'rating' => 5,
                'content' => 'Le salon majlis est une pièce signature. Tounkara a su équilibrer tradition et modernité avec une justesse rare.',
                'order' => 4,
            ],
            [
                'client_name' => 'Famille Ndiaye',
                'client_role' => 'Particuliers',
                'city' => 'Tivaoune',
                'project_city' => 'Tivaoune',
                'rating' => 5,
                'content' => 'Le trompe-l\'œil dans le séjour bluffe tous nos invités. On a l\'impression d\'avoir gagné une pièce supplémentaire.',
                'order' => 5,
            ],
            [
                'client_name' => 'Mr. Conté',
                'client_role' => 'Restaurateur',
                'city' => 'Banjul (Gambie)',
                'project_city' => 'Gambie',
                'rating' => 5,
                'content' => 'La fresque sur la façade attire les passants — nos couverts ont doublé en deux mois. Investissement artistique qui parle aussi business.',
                'order' => 6,
            ],
            [
                'client_name' => 'Aminetou Salem',
                'client_role' => 'Maître d\'ouvrage',
                'city' => 'Nouakchott (Mauritanie)',
                'project_city' => 'Mauritanie',
                'rating' => 5,
                'content' => 'Les plafonds aux motifs touaregs honorent notre culture tout en restant contemporains. Chaque détail est pensé. Merci Tounkara.',
                'order' => 7,
            ],
            [
                'client_name' => 'Fatou Senghor',
                'client_role' => 'Galeriste',
                'city' => 'Dakar',
                'project_city' => 'Dakar',
                'rating' => 5,
                'content' => 'Lartiska, c\'est l\'art appliqué à l\'espace. Tounkara mérite sa place parmi les grands.',
                'order' => 8,
            ],
        ];

        foreach ($rows as $row) {
            $projectId = $projects[$row['project_city']] ?? null;

            Testimonial::create([
                'client_name' => $row['client_name'],
                'client_role' => $row['client_role'],
                'city' => $row['city'],
                'project_id' => $projectId,
                'content' => $row['content'],
                'rating' => $row['rating'],
                'is_published' => true,
                'order' => $row['order'],
            ]);
        }
    }
}
