<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'user_id',
        'service_id',
        'client_name',
        'client_email',
        'client_phone',
        'client_city',
        'site_address',
        'description',
        'surface_m2',
        'estimated_budget',
        'total_amount',
        'status',
        'pdf_path',
        'attachments',
        'admin_notes',
        'sent_at',
        'accepted_at',
    ];

    protected $casts = [
        'surface_m2' => 'decimal:2',
        'estimated_budget' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'attachments' => 'array',
        'sent_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    protected static function booted(): void
    {
        static::creating(function (Quote $quote) {
            if (empty($quote->reference)) {
                $quote->reference = static::generateReference();
            }
        });
    }

    public static function generateReference(): string
    {
        $year = now()->year;
        $next = (static::whereYear('created_at', $year)->count() + 1);

        return sprintf('LRTSK-%d-%04d', $year, $next);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class)->orderBy('order');
    }

    public function contract(): HasOne
    {
        return $this->hasOne(Contract::class);
    }
}
