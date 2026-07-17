<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

/**
 * Génère une paire de clés VAPID pour les notifications Web Push.
 * À lancer UNE FOIS ; copier les valeurs dans les variables Railway
 * (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY). Ne jamais commiter la privée.
 */
class GenerateVapidKeys extends Command
{
    protected $signature = 'webpush:vapid';

    protected $description = 'Génère les clés VAPID (à copier dans les variables Railway)';

    public function handle(): int
    {
        $keys = VAPID::createVapidKeys();

        $this->info('Clés VAPID générées — à poser dans Railway (service backend → Variables) :');
        $this->newLine();
        $this->line('VAPID_PUBLIC_KEY=' . $keys['publicKey']);
        $this->line('VAPID_PRIVATE_KEY=' . $keys['privateKey']);
        $this->newLine();
        $this->warn('Ne partagez jamais la clé privée (ni chat, ni repo).');

        return self::SUCCESS;
    }
}
