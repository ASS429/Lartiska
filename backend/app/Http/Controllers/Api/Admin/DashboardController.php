<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Message;
use App\Models\Project;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalQuotes = Quote::count();
        $acceptedQuotes = Quote::where('status', 'accepted')->count();

        return response()->json([
            'data' => [
                'quotes' => [
                    'total' => $totalQuotes,
                    'pending' => Quote::where('status', 'pending')->count(),
                    'processing' => Quote::where('status', 'processing')->count(),
                    'sent' => Quote::where('status', 'sent')->count(),
                    'accepted' => $acceptedQuotes,
                    'rejected' => Quote::where('status', 'rejected')->count(),
                    'this_month' => Quote::whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                        ->count(),
                    'acceptance_rate' => $totalQuotes > 0
                        ? round($acceptedQuotes * 100 / $totalQuotes, 1)
                        : 0,
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

                // Série mensuelle : 6 derniers mois (count + total accepted)
                'quotes_monthly' => $this->monthlyQuotes(),

                // Top 5 services demandés
                'top_services' => $this->topServices(),

                'recent_quotes' => Quote::with('service:id,title')
                    ->latest()
                    ->limit(5)
                    ->get(['id', 'reference', 'client_name', 'service_id', 'status', 'created_at']),

                'recent_messages' => Message::latest()
                    ->limit(5)
                    ->get(['id', 'name', 'subject', 'source', 'is_read', 'created_at']),

                'recent_activity' => ActivityLog::with('user:id,name')
                    ->latest()
                    ->limit(10)
                    ->get(['id', 'user_id', 'action', 'subject_type', 'subject_id', 'properties', 'created_at']),
            ],
        ]);
    }

    private function monthlyQuotes(): array
    {
        $start = now()->copy()->subMonths(5)->startOfMonth();

        $rows = Quote::select(
                DB::raw('YEAR(created_at) as y'),
                DB::raw('MONTH(created_at) as m'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN status = "accepted" THEN 1 ELSE 0 END) as accepted'),
            )
            ->where('created_at', '>=', $start)
            ->groupBy('y', 'm')
            ->orderBy('y')
            ->orderBy('m')
            ->get()
            ->keyBy(fn ($r) => sprintf('%04d-%02d', $r->y, $r->m));

        $series = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->copy()->subMonths($i);
            $key = $date->format('Y-m');
            $row = $rows->get($key);
            $series[] = [
                'label' => $date->locale('fr')->isoFormat('MMM'),
                'year_month' => $key,
                'count' => $row ? (int) $row->count : 0,
                'accepted' => $row ? (int) $row->accepted : 0,
            ];
        }

        return $series;
    }

    private function topServices(): array
    {
        return Quote::select('service_id', DB::raw('COUNT(*) as count'))
            ->whereNotNull('service_id')
            ->groupBy('service_id')
            ->orderByDesc('count')
            ->limit(5)
            ->with('service:id,title')
            ->get()
            ->map(fn ($r) => [
                'service_id' => $r->service_id,
                'title' => $r->service?->title ?? 'Service inconnu',
                'count' => (int) $r->count,
            ])
            ->toArray();
    }
}
