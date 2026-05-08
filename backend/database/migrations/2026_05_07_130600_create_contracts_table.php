<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('quote_id')->constrained()->restrictOnDelete();
            $table->decimal('total_amount', 12, 2);
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->decimal('balance_amount', 12, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('expected_end_date')->nullable();
            $table->date('completed_at')->nullable();
            $table->string('signature_path')->nullable();
            $table->string('signed_pdf_path')->nullable();
            $table->string('signature_token', 80)->nullable()->unique();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->enum('status', ['draft', 'sent', 'signed', 'in_progress', 'completed', 'cancelled'])
                ->default('draft')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
