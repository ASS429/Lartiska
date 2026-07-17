<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Abonnements Web Push des visiteurs (PWA) : notifiés à chaque nouvelle
 * publication ou mise à jour du portfolio depuis l'admin.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            // L'endpoint identifie l'abonnement chez le fournisseur push
            // (FCM/Mozilla/APNs). Hash sha256 pour l'unicité (l'URL peut
            // dépasser les limites d'index MySQL).
            $table->string('endpoint_hash', 64)->unique();
            $table->text('endpoint');
            $table->string('public_key');   // p256dh
            $table->string('auth_token');   // auth
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
