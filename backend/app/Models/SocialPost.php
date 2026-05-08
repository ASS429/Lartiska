<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform',
        'external_id',
        'content',
        'media_url',
        'thumbnail_url',
        'media_type',
        'permalink',
        'likes_count',
        'comments_count',
        'is_featured_in_portfolio',
        'linked_project_id',
        'published_at',
    ];

    protected $casts = [
        'is_featured_in_portfolio' => 'boolean',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
        'published_at' => 'datetime',
    ];

    public function linkedProject(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'linked_project_id');
    }

    public function scopeForFeed($query)
    {
        return $query->orderByDesc('published_at');
    }
}
