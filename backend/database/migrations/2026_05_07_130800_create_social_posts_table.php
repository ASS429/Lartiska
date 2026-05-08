<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_posts', function (Blueprint $table) {
            $table->id();
            $table->enum('platform', ['instagram', 'facebook', 'tiktok', 'youtube', 'snapchat'])->index();
            $table->string('external_id')->index();
            $table->text('content')->nullable();
            $table->string('media_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('media_type', 20)->nullable();
            $table->string('permalink')->nullable();
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->boolean('is_featured_in_portfolio')->default(false)->index();
            $table->foreignId('linked_project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['platform', 'external_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_posts');
    }
};
