<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Enregistre une action utilisateur (admin ou client) liée à un modèle.
     *
     * Exemple :
     *   ActivityLogger::log('quote.send_to_client', $quote, ['recipient' => $quote->client_email]);
     */
    public static function log(string $action, ?Model $subject = null, array $properties = []): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'properties' => $properties ?: null,
            'ip_address' => Request::ip(),
        ]);
    }
}
