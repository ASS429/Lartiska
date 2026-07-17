<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/**
 * Sitemap complet (pages statiques + projets publiés) — voir
 * SitemapController. Le frontend le proxifie via un rewrite Render
 * (/sitemap.xml) pour que Google le lise sur le domaine principal.
 * L'ancienne URL /sitemap-projects.xml reste servie (robots.txt legacy).
 */
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/sitemap-projects.xml', SitemapController::class)->name('sitemap.projects');
