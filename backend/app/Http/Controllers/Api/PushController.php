<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushController extends Controller
{
    /** Clé publique VAPID — nécessaire au navigateur pour s'abonner. */
    public function key(): JsonResponse
    {
        return response()->json(['data' => ['key' => config('webpush.public_key')]]);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string', 'max:2000', 'url'],
            'keys.p256dh' => ['required', 'string', 'max:255'],
            'keys.auth' => ['required', 'string', 'max:255'],
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint_hash' => hash('sha256', $data['endpoint'])],
            [
                'endpoint' => $data['endpoint'],
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
            ],
        );

        return response()->json(['message' => 'Abonné aux notifications.'], 201);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $request->validate(['endpoint' => ['required', 'string', 'max:2000']]);

        PushSubscription::where('endpoint_hash', hash('sha256', $request->string('endpoint')))->delete();

        return response()->json(['message' => 'Désabonné.']);
    }
}
