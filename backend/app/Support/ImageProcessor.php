<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

/**
 * Retraite chaque image uploadée avant stockage :
 *
 *  - ré-encode en WebP → neutralise les fichiers polyglottes (une "image"
 *    valide qui contient aussi du PHP/JS) et supprime TOUTES les métadonnées
 *    EXIF, dont les coordonnées GPS des photos de chantier prises au
 *    téléphone (adresse du domicile des clients) ;
 *  - limite la plus grande dimension (2560px) et recompresse ;
 *  - génère une vignette 640px pour les listes/grilles.
 */
class ImageProcessor
{
    private const MAX_DIMENSION = 2560;
    private const THUMB_DIMENSION = 640;
    private const QUALITY = 82;
    private const THUMB_QUALITY = 75;

    /**
     * @return array{path: string, thumbnail: string, width: int, height: int}
     */
    public static function storeProjectImage(UploadedFile $file, int $projectId): array
    {
        $manager = ImageManager::gd();
        $disk = config('filesystems.default');
        $basename = Str::uuid()->toString();
        $dir = 'projects/' . $projectId;

        // GD re-décode les pixels : tout ce qui n'est pas de l'image (EXIF,
        // GPS, charge utile cachée) est perdu au ré-encodage.
        $image = $manager->read($file->getRealPath());
        $image->scaleDown(self::MAX_DIMENSION, self::MAX_DIMENSION);

        $path = $dir . '/' . $basename . '.webp';
        Storage::disk($disk)->put($path, (string) $image->toWebp(self::QUALITY));

        $width = $image->width();
        $height = $image->height();

        $thumb = $manager->read($file->getRealPath());
        $thumb->scaleDown(self::THUMB_DIMENSION, self::THUMB_DIMENSION);
        $thumbPath = $dir . '/' . $basename . '_thumb.webp';
        Storage::disk($disk)->put($thumbPath, (string) $thumb->toWebp(self::THUMB_QUALITY));

        return [
            'path' => $path,
            'thumbnail' => $thumbPath,
            'width' => $width,
            'height' => $height,
        ];
    }
}
