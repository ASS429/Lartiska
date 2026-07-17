<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

/**
 * Sitemap XML du site public — servi sur /sitemap.xml (côté API) et
 * proxifié par le frontend (rewrite Render /sitemap.xml → ici) pour que
 * Google le lise sur le domaine principal.
 *
 * Les URLs pointent vers FRONTEND_URL : au changement de domaine, seule
 * la variable Railway change, le sitemap suit tout seul.
 */
class SitemapController extends Controller
{
    private const STATIC_PAGES = [
        ['path' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
        ['path' => '/services', 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['path' => '/portfolio', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['path' => '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['path' => '/devis', 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['path' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['path' => '/faq', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ];

    public function __invoke(): Response
    {
        $xml = Cache::remember('sitemap-xml', now()->addMinutes(30), function () {
            $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'https://lartiska.onrender.com')), '/');

            $urls = [];
            foreach (self::STATIC_PAGES as $page) {
                $urls[] = [
                    'loc' => $base . $page['path'],
                    'priority' => $page['priority'],
                    'changefreq' => $page['changefreq'],
                ];
            }

            foreach (Project::published()->get(['slug', 'updated_at']) as $project) {
                $urls[] = [
                    'loc' => $base . '/portfolio/' . $project->slug,
                    'lastmod' => $project->updated_at?->toAtomString(),
                    'priority' => '0.8',
                    'changefreq' => 'monthly',
                ];
            }

            $out = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $out .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
            foreach ($urls as $u) {
                $out .= "  <url>\n    <loc>" . e($u['loc']) . "</loc>\n";
                if (!empty($u['lastmod'])) {
                    $out .= '    <lastmod>' . $u['lastmod'] . "</lastmod>\n";
                }
                $out .= '    <changefreq>' . $u['changefreq'] . "</changefreq>\n";
                $out .= '    <priority>' . $u['priority'] . "</priority>\n  </url>\n";
            }
            $out .= '</urlset>';

            return $out;
        });

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
