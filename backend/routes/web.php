<?php

use App\Models\Project;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/**
 * Sitemap dynamique des projets publiés (URL : /sitemap-projects.xml).
 * Référencé depuis web/public/robots.txt.
 * Servi avec un cache 1h pour éviter de matraquer la BDD si Google crawl.
 */
Route::get('/sitemap-projects.xml', function () {
    $base = rtrim(config('app.frontend_url', 'https://lartiska.onrender.com'), '/');

    $projects = Project::query()
        ->where('status', 'published')
        ->orderByDesc('completed_at')
        ->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($projects as $p) {
        $loc = htmlspecialchars($base . '/portfolio/' . $p->slug, ENT_XML1);
        $lastmod = $p->updated_at?->toAtomString() ?? now()->toAtomString();
        $xml .= "  <url>\n";
        $xml .= "    <loc>{$loc}</loc>\n";
        $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.7</priority>\n";
        $xml .= "  </url>\n";
    }
    $xml .= '</urlset>';

    return Response::make($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
})->name('sitemap.projects');
