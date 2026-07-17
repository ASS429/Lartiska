<?php

namespace App\Support;

use App\Models\PushSubscription;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

/**
 * Envoi des notifications Web Push à tous les abonnés (PWA).
 * Les abonnements expirés (404/410) sont purgés au fil de l'eau.
 * Silencieux si les clés VAPID ne sont pas configurées.
 */
class WebPushSender
{
    /**
     * @param array{title: string, body: string, url?: string} $payload
     */
    public static function broadcast(array $payload): void
    {
        $publicKey = config('webpush.public_key');
        $privateKey = config('webpush.private_key');
        if (!$publicKey || !$privateKey) {
            return; // VAPID non configuré — pas d'envoi, pas d'erreur.
        }

        $subscriptions = PushSubscription::all();
        if ($subscriptions->isEmpty()) {
            return;
        }

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => config('webpush.subject'),
                'publicKey' => $publicKey,
                'privateKey' => $privateKey,
            ],
        ]);

        $json = json_encode([
            'title' => $payload['title'],
            'body' => $payload['body'],
            'url' => $payload['url'] ?? '/',
            'icon' => rtrim(config('webpush.subject'), '/') . '/icons/icon-192.png',
        ]);

        foreach ($subscriptions as $sub) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->public_key,
                    'authToken' => $sub->auth_token,
                ]),
                $json,
            );
        }

        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess()) {
                // Abonnement mort (navigateur désinstallé, permission retirée…)
                if ($report->isSubscriptionExpired()) {
                    PushSubscription::where('endpoint_hash', hash('sha256', $report->getEndpoint()))->delete();
                } else {
                    Log::warning('WebPush failed', ['reason' => $report->getReason()]);
                }
            }
        }
    }
}
