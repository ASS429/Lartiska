<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'path',
        'caption',
        'order',
        'is_cover',
        'width',
        'height',
    ];

    protected $casts = [
        'is_cover' => 'boolean',
        'order' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
