<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Headers de sécurité appliqués à toutes les réponses.
 *
 * L'API est consommée par le frontend React (Render) et l'app mobile :
 * on bloque l'embarquement en iframe, le sniffing MIME et on limite
 * les informations de referrer. HSTS n'est envoyé qu'en HTTPS.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        if ($request->secure()) {
            // 1 an, sous-domaines inclus. Le TLS est terminé par Render/Railway
            // mais trustProxies (bootstrap/app.php) propage bien le scheme.
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // CSP restrictive : l'API ne sert pas de HTML applicatif, on interdit tout
        // par défaut (les fichiers /storage sont servis en statique par le serveur web).
        if (!$request->is('storage/*')) {
            $response->headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
        }

        return $response;
    }
}
