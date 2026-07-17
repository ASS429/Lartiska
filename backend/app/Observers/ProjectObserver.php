<?php

namespace App\Observers;

use App\Models\Project;
use App\Support\WebPushSender;
use Illuminate\Support\Facades\Cache;

/**
 * Notifie les abonnés push (PWA) quand le portfolio bouge depuis l'admin :
 *  - un projet passe en "published"  → « Nouvelle réalisation »
 *  - un projet déjà publié est modifié → « Réalisation mise à jour »
 *
 * Garde-fous anti-spam :
 *  - l'envoi part APRÈS la réponse HTTP (dispatchAfterResponse) — l'admin
 *    ne subit aucune latence ;
 *  - une même mise à jour de projet ne re-notifie pas avant 6 h (les
 *    uploads d'images successifs touchent le projet plusieurs fois).
 */
class ProjectObserver
{
    public function updated(Project $project): void
    {
        $becamePublished = $project->wasChanged('status') && $project->status === 'published';
        $publishedUpdate = !$project->wasChanged('status') && $project->status === 'published';

        if ($becamePublished) {
            $this->notify($project, 'Nouvelle réalisation Lartiska ✨', $project->title);
        } elseif ($publishedUpdate) {
            $lock = 'push-notified-project-' . $project->id;
            if (!Cache::has($lock)) {
                Cache::put($lock, true, now()->addHours(6));
                $this->notify($project, 'Réalisation mise à jour', $project->title);
            }
        }
    }

    public function created(Project $project): void
    {
        if ($project->status === 'published') {
            $this->notify($project, 'Nouvelle réalisation Lartiska ✨', $project->title);
        }
    }

    private function notify(Project $project, string $title, string $body): void
    {
        $url = '/portfolio/' . $project->slug;

        dispatch(function () use ($title, $body, $url) {
            WebPushSender::broadcast([
                'title' => $title,
                'body' => $body,
                'url' => $url,
            ]);
        })->afterResponse();
    }
}
