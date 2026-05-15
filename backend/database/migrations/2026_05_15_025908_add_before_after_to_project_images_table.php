<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_images', function (Blueprint $table) {
            // 'before' / 'after' s'apparient consécutivement par 'order'.
            // 'none' = image normale (défaut).
            $table->enum('before_after', ['none', 'before', 'after'])
                ->default('none')
                ->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('project_images', function (Blueprint $table) {
            $table->dropColumn('before_after');
        });
    }
};
