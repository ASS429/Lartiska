<?php

namespace App\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Abstraction du stockage des fichiers privés (PDFs des devis, pièces jointes).
 *
 * - En dev local : disque "local" (filesystem éphémère mais ok)
 * - En production : disque "r2" (Cloudflare R2) avec visibilité private +
 *   URLs signées temporaires pour le download
 *
 * Le disque actif est défini par config('filesystems.private_disk').
 */
class PrivateStorage
{
    public static function disk(): Filesystem
    {
        return Storage::disk(self::diskName());
    }

    public static function diskName(): string
    {
        return config('filesystems.private_disk', 'local');
    }

    /**
     * Stocke un contenu en privé. Retourne le chemin relatif.
     */
    public static function put(string $path, string $contents): string
    {
        // 'private' visibility est respectée par S3/R2.
        // Pour le disque local, c'est ignoré (filesystem habituel).
        self::disk()->put($path, $contents, 'private');
        return $path;
    }

    /**
     * Stocke un fichier uploadé en privé. Retourne le chemin relatif.
     */
    public static function putFile(string $directory, $file): string
    {
        return self::disk()->putFile($directory, $file, 'private');
    }

    public static function exists(string $path): bool
    {
        return self::disk()->exists($path);
    }

    public static function get(string $path): ?string
    {
        return self::disk()->get($path);
    }

    public static function delete(string $path): bool
    {
        return self::disk()->delete($path);
    }

    /**
     * Génère une réponse de download adaptée au type de disque.
     *
     * - Local : stream direct via Laravel
     * - R2 / S3 : redirect vers une URL signée valable 10 min
     */
    public static function download(string $path, string $downloadName): StreamedResponse|RedirectResponse
    {
        $disk = self::diskName();

        // Disque local → on stream depuis le filesystem
        if ($disk === 'local' || $disk === 'public') {
            return self::disk()->download($path, $downloadName);
        }

        // Disque cloud (S3/R2) → URL signée temporaire avec content-disposition forcé
        $url = self::disk()->temporaryUrl(
            $path,
            now()->addMinutes(10),
            [
                'ResponseContentDisposition' => 'attachment; filename="' . $downloadName . '"',
                'ResponseContentType' => 'application/pdf',
            ],
        );

        return redirect()->away($url);
    }
}
