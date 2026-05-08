<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        $message = Message::create([
            ...$request->validated(),
            'source' => 'web',
        ]);

        return response()->json([
            'data' => $message,
            'message' => 'Merci, votre message est bien arrivé.',
        ], 201);
    }
}
