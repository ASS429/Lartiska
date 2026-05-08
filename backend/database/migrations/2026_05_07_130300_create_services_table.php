<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('price_from', 12, 2)->nullable();
            $table->decimal('price_to', 12, 2)->nullable();
            $table->enum('unit', ['m2', 'ml', 'forfait', 'piece', 'jour'])->default('m2');
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
