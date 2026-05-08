<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'quotes' => [
                    'total' => Quote::count(),
                    'pending' => Quote::where('status', 'pending')->count(),
                    'processing' => Quote::where('status', 'processing')->count(),
                    'sent' => Quote::where('status', 'sent')->count(),
                    'accepted' => Quote::where('status', 'accepted')->count(),
                    'this_month' => Quote::whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                        ->count(),
                ],
                'messages' => [
                    'total' => Message::count(),
                    'unread' => Message::unread()->count(),
                ],
                'projects' => [
                    'total' => Project::count(),
                    'published' => Project::published()->count(),
                    'featured' => Project::featured()->count(),
                ],
                'clients' => [
                    'total' => User::where('role', 'client')->count(),
                ],
                'recent_quotes' => Quote::with('service:id,title')
                    ->latest()
                    ->limit(5)
                    ->get(['id', 'reference', 'client_name', 'service_id', 'status', 'created_at']),
                'recent_messages' => Message::latest()
                    ->limit(5)
                    ->get(['id', 'name', 'subject', 'source', 'is_read', 'created_at']),
            ],
        ]);
    }
}
