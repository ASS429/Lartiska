<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Message::latest();

        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        if ($source = $request->string('source')->toString()) {
            $query->where('source', $source);
        }

        $messages = $query->paginate($request->integer('per_page', 20));

        return response()->json($messages);
    }

    public function show(Message $message): JsonResponse
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return response()->json(['data' => $message]);
    }

    public function markRead(Message $message): JsonResponse
    {
        $message->update(['is_read' => true]);

        return response()->json([
            'data' => $message,
            'message' => 'Message marqué comme lu.',
        ]);
    }
}
