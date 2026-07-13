<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Toutes les URLs générées (liens PDF, reset password…) doivent être
        // en https en production — Railway termine le TLS en frontal.
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Le lien de reset password dans l'email pointe vers le frontend React
        // (et non une route Laravel inexistante) :
        //   {FRONTEND_URL}/reset-password?token={token}&email={email}
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'https://lartiska.onrender.com')), '/');

            return $base . '/reset-password?' . http_build_query([
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ]);
        });
    }
}
