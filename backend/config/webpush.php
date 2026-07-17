<?php

/*
| Clés VAPID pour Web Push (notifications PWA).
| À générer une seule fois (php artisan webpush:vapid) et à poser dans
| les variables Railway. La clé publique est distribuée au navigateur
| via GET /api/push/key ; la privée ne quitte jamais le serveur.
|
| IMPORTANT : passer par config() (jamais env() dans le code) — la prod
| tourne avec config:cache.
*/
return [
    'public_key' => env('VAPID_PUBLIC_KEY'),
    'private_key' => env('VAPID_PRIVATE_KEY'),
    'subject' => env('VAPID_SUBJECT', env('FRONTEND_URL', 'https://lartiska.onrender.com')),
];
