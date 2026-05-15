<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class MediaUrl
{
    /**
     * Transforme un chemin stocké (ex: "projects/1/cover.jpg") en URL ABSOLUE.
     * Indispensable pour les clients qui ne sont pas servis par le même domaine
     * (apps mobiles, e-mails, etc.).
     *
     * - Disque 'r2' (prod) : Storage::url() renvoie déjà l'URL publique R2 absolue.
     * - Disque 'public' (local) : Storage::url() renvoie /storage/xxx → on
     *   ajoute APP_URL pour en faire un absolute.
     */
    public static function absolute(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $url = Storage::url($path);

        // Déjà absolu (http:// ou https://)
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        // Sinon on préfixe avec APP_URL
        return rtrim(config('app.url', ''), '/') . $url;
    }
}
