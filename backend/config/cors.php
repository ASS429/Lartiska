<?php

/*
| ─────────────────────────────────────────────
| CORS — Lartiska
| Strict allow-list. Pas de wildcards larges.
| Pour ajouter un nouveau domaine (preview Render, autre staging…) :
|   FRONTEND_EXTRA_ORIGINS="https://x.example,https://y.example"
| ─────────────────────────────────────────────
*/

$extra = array_values(array_filter(
    array_map('trim', explode(',', (string) env('FRONTEND_EXTRA_ORIGINS', '')))
));

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Origines fixes (dev local + URL frontend déclarée + extras opt-in)
    'allowed_origins' => array_values(array_unique(array_filter(array_merge(
        [
            env('FRONTEND_URL', 'http://localhost:5173'),
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
        $extra,
    )))),

    // Patterns régex — uniquement sous notre vrai domaine.
    // Render et Railway sont délibérément exclus pour éviter d'ouvrir
    // l'API aux subdomains *.onrender.com / *.railway.app d'autres projets.
    'allowed_origins_patterns' => [
        '#^https://([a-z0-9-]+\.)?lartiska\.com$#',
        '#^https://([a-z0-9-]+\.)?lartiska\.art$#',
        '#^https://([a-z0-9-]+\.)?lartiska\.sn$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
