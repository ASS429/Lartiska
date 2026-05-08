<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone', 30);
            $table->string('client_city')->nullable();
            $table->string('site_address')->nullable();
            $table->text('description')->nullable();
            $table->decimal('surface_m2', 10, 2)->nullable();
            $table->decimal('estimated_budget', 12, 2)->nullable();
            $table->decimal('total_amount', 12, 2)->nullable();
            $table->enum('status', ['pending', 'processing', 'sent', 'accepted', 'rejected', 'expired'])
                ->default('pending')->index();
            $table->string('pdf_path')->nullable();
            $table->json('attachments')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
