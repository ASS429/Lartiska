<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $villesPath = realpath(base_path('../villes'));

        if (!$villesPath || !is_dir($villesPath)) {
            $this->command?->warn("Dossier villes/ introuvable ($villesPath) — seeder ignoré.");
            return;
        }

        $cities = [
            'Dakar' => [
                'category_slug' => 'peinture-fresques',
                'title' => 'Résidence d\'auteur — Almadies',
                'description' => 'Fresque murale sur trois étages d\'une villa contemporaine. Composition mêlant émeraude profond, or à la feuille et touches de rose poudré, exécutée à main levée sur 60 m². Quatre semaines d\'atelier sur place.',
                'materials' => 'Acrylique haute couvrance, feuilles d\'or 22 carats',
                'duration' => '4 semaines',
                'completed_at' => '2025-11-12',
                'featured' => true,
            ],
            'Thiès' => [
                'category_slug' => 'plafonnage',
                'title' => 'Plafond cathédrale — Villa privée',
                'description' => 'Plafond plâtre orné de motifs géométriques floraux. Reliefs en gypse, finition mate cassée et dorures à la feuille en bordure. Tomé sur 90 m².',
                'materials' => 'Plâtre fin, dorures à la feuille',
                'duration' => '3 semaines',
                'completed_at' => '2025-09-30',
                'featured' => true,
            ],
            'Saint-Louis' => [
                'category_slug' => 'carrelage',
                'title' => 'Mosaïque sur-mesure — Hôtel Faidherbe',
                'description' => 'Sol en mosaïque artistique inspirée des motifs textiles wolofs. Tesselles en terre cuite émaillée et inserts laiton, posée sur 45 m². Pièce signature pour la réception de l\'hôtel.',
                'materials' => 'Tesselles émaillées, joints sable doré',
                'duration' => '5 semaines',
                'completed_at' => '2025-07-22',
                'featured' => true,
            ],
            'Tivaoune' => [
                'category_slug' => 'peinture-fresques',
                'title' => 'Trompe-l\'œil — Maison familiale',
                'description' => 'Trompe-l\'œil grand format évoquant un patio andalou imaginé : arches, fontaine, jeux de lumière. Réalisé à l\'acrylique sur enduit lissé.',
                'materials' => 'Acrylique mate, glacis',
                'duration' => '2 semaines',
                'completed_at' => '2025-06-08',
                'featured' => false,
            ],
            'Touba' => [
                'category_slug' => 'decoration',
                'title' => 'Salon majlis — Concept complet',
                'description' => 'Conception et exécution d\'un salon majlis : moulures plâtre, fresque murale, rideaux sur-mesure, sélection mobilier. 80 m² livré clés en main.',
                'materials' => 'Plâtre, peintures décoratives, textiles importés',
                'duration' => '6 semaines',
                'completed_at' => '2025-04-15',
                'featured' => true,
            ],
            'Ziguinchor' => [
                'category_slug' => 'carrelage',
                'title' => 'Hammam privé — Villa du Cap',
                'description' => 'Hammam orné de mosaïques zellige bleu profond et or, jeux de lumière dans la vapeur. Pose patiente sur surface courbe.',
                'materials' => 'Zellige cuit, mortier hydrofuge',
                'duration' => '4 semaines',
                'completed_at' => '2025-02-20',
                'featured' => false,
            ],
            'Gambie' => [
                'category_slug' => 'peinture-fresques',
                'title' => 'Façade artistique — Banjul',
                'description' => 'Façade extérieure transformée en fresque urbaine : symbolique côtière, palette océan-coucher de soleil. Œuvre visible depuis la corniche.',
                'materials' => 'Peinture façade extérieure, pigments minéraux',
                'duration' => '3 semaines',
                'completed_at' => '2024-12-10',
                'featured' => true,
            ],
            'Mauritanie' => [
                'category_slug' => 'plafonnage',
                'title' => 'Plafonds nomades — Nouakchott',
                'description' => 'Trois plafonds décoratifs inspirés des motifs touaregs : reliefs croisés, finition sable. Ensemble livré pour une résidence de prestige.',
                'materials' => 'Plâtre coloré, pigments terre',
                'duration' => '4 semaines',
                'completed_at' => '2024-10-05',
                'featured' => false,
            ],
        ];

        $disk = Storage::disk('public');

        foreach ($cities as $cityName => $data) {
            $cityFolder = $villesPath . DIRECTORY_SEPARATOR . $cityName;
            if (!is_dir($cityFolder)) {
                $this->command?->warn("Sous-dossier introuvable : {$cityFolder}");
                continue;
            }

            $category = Category::where('slug', $data['category_slug'])->first();
            if (!$category) {
                $this->command?->warn("Catégorie '{$data['category_slug']}' introuvable.");
                continue;
            }

            $images = collect(File::files($cityFolder))
                ->filter(fn ($f) => in_array(strtolower($f->getExtension()), ['jpg', 'jpeg', 'png', 'webp']))
                ->values();

            if ($images->isEmpty()) continue;

            $project = Project::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'description' => $data['description'],
                'category_id' => $category->id,
                'city' => $cityName,
                'materials' => $data['materials'],
                'duration' => $data['duration'],
                'completed_at' => $data['completed_at'],
                'status' => 'published',
                'featured' => $data['featured'],
                'order' => 0,
            ]);

            $coverPath = null;

            foreach ($images as $idx => $file) {
                $newName = $project->id . '-' . $idx . '-' . Str::random(6) . '.' . $file->getExtension();
                $relativePath = "projects/{$project->id}/{$newName}";

                $disk->put($relativePath, file_get_contents($file->getPathname()));

                ProjectImage::create([
                    'project_id' => $project->id,
                    'path' => $relativePath,
                    'type' => 'image',
                    'caption' => null,
                    'order' => $idx,
                    'is_cover' => $idx === 0,
                ]);

                if ($idx === 0) {
                    $coverPath = $relativePath;
                }
            }

            if ($coverPath) {
                $project->update(['cover_image' => $coverPath]);
            }

            $this->command?->info("✓ Projet '{$project->title}' ({$images->count()} images) créé.");
        }
    }
}
