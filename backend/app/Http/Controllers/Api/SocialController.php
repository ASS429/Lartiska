<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocialController extends Controller
{
    public function feed(Request $request): JsonResponse
    {
        $platform = $request->string('platform')->toString();

        $query = SocialPost::forFeed();
        if ($platform) {
            $query->where('platform', $platform);
        }

        $posts = $query->limit(min($request->integer('limit', 12), 30))->get();

        return response()->json(['data' => $posts]);
    }
}
