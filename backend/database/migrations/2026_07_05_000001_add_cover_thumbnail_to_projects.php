<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Vignette 640px de l'image de couverture : servie dans les grilles
            // (home, portfolio) à la place de l'original — gain majeur en data.
            $table->string('cover_thumbnail')->nullable()->after('cover_image');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('cover_thumbnail');
        });
    }
};
