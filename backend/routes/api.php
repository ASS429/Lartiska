<?php

use App\Http\Controllers\Api\Account\QuoteController as AccountQuoteController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\ProjectImageController as AdminProjectImageController;
use App\Http\Controllers\Api\Admin\QuoteController as AdminQuoteController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SocialController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes publiques
|--------------------------------------------------------------------------
*/
Route::get('/health', fn () => ['status' => 'ok', 'app' => config('app.name'), 'time' => now()->toIso8601String()]);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
});

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

Route::get('/services', [ServiceController::class, 'index']);

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::post('/quotes', [QuoteController::class, 'store'])->middleware('throttle:5,1');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

Route::get('/social/feed', [SocialController::class, 'feed']);

Route::get('/settings/public', [SettingController::class, 'publicSettings']);

/*
|--------------------------------------------------------------------------
| Routes authentifiées (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/quotes/{quote}', [QuoteController::class, 'show']);
    Route::get('/quotes/{quote}/pdf', [QuoteController::class, 'downloadPdf'])->name('quotes.pdf');

    /*
    | Espace client : /api/account/*
    */
    Route::prefix('account')->group(function () {
        Route::get('/quotes', [AccountQuoteController::class, 'index']);
    });

    /*
    | Espace admin : /api/admin/*  (requiert role=admin)
    */
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Devis
        Route::get('/quotes', [AdminQuoteController::class, 'index']);
        Route::get('/quotes/{quote}', [AdminQuoteController::class, 'show']);
        Route::patch('/quotes/{quote}', [AdminQuoteController::class, 'update']);
        Route::post('/quotes/{quote}/generate-pdf', [AdminQuoteController::class, 'generatePdf']);
        Route::post('/quotes/{quote}/send-to-client', [AdminQuoteController::class, 'sendToClient']);

        // Messages
        Route::get('/messages', [AdminMessageController::class, 'index']);
        Route::get('/messages/{message}', [AdminMessageController::class, 'show']);
        Route::patch('/messages/{message}/read', [AdminMessageController::class, 'markRead']);

        // Catégories
        Route::get('/categories', [AdminCategoryController::class, 'index']);

        // Projets
        Route::get('/projects', [AdminProjectController::class, 'index']);
        Route::post('/projects', [AdminProjectController::class, 'store']);
        Route::get('/projects/{project}', [AdminProjectController::class, 'show']);
        Route::patch('/projects/{project}', [AdminProjectController::class, 'update']);
        Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy']);

        Route::post('/projects/{project}/images', [AdminProjectImageController::class, 'store']);
        Route::patch('/projects/{project}/images/reorder', [AdminProjectImageController::class, 'reorder']);
        Route::patch('/projects/{project}/images/{image}/cover', [AdminProjectImageController::class, 'setCover']);
        Route::delete('/projects/{project}/images/{image}', [AdminProjectImageController::class, 'destroy']);

        // Services
        Route::get('/services', [AdminServiceController::class, 'index']);
        Route::post('/services', [AdminServiceController::class, 'store']);
        Route::get('/services/{service}', [AdminServiceController::class, 'show']);
        Route::patch('/services/{service}', [AdminServiceController::class, 'update']);
        Route::delete('/services/{service}', [AdminServiceController::class, 'destroy']);

        // Avis clients
        Route::get('/testimonials', [AdminTestimonialController::class, 'index']);
        Route::post('/testimonials', [AdminTestimonialController::class, 'store']);
        Route::get('/testimonials/{testimonial}', [AdminTestimonialController::class, 'show']);
        Route::patch('/testimonials/{testimonial}', [AdminTestimonialController::class, 'update']);
        Route::delete('/testimonials/{testimonial}', [AdminTestimonialController::class, 'destroy']);

        // Réglages
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);
    });
});
