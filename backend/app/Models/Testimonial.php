<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    protected $fillable = [
        'client_name',
        'client_role',
        'city',
        'project_id',
        'content',
        'rating',
        'avatar',
        'is_published',
        'order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'rating' => 'integer',
        'order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
