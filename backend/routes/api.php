<?php

use App\Http\Controllers\Api\Account\QuoteController as AccountQuoteController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Api\Admin\QuoteController as AdminQuoteController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SocialController;
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
    Route::get('/quotes/{quote}/pdf', [QuoteController::class, 'downloadPdf']);

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

        Route::get('/quotes', [AdminQuoteController::class, 'index']);
        Route::get('/quotes/{quote}', [AdminQuoteController::class, 'show']);
        Route::patch('/quotes/{quote}', [AdminQuoteController::class, 'update']);

        Route::get('/messages', [AdminMessageController::class, 'index']);
        Route::get('/messages/{message}', [AdminMessageController::class, 'show']);
        Route::patch('/messages/{message}/read', [AdminMessageController::class, 'markRead']);
    });
});
