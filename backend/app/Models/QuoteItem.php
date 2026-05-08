<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'description',
        'quantity',
        'unit',
        'unit_price',
        'total',
        'order',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
        'order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (QuoteItem $item) {
            $item->total = round($item->quantity * $item->unit_price, 2);
        });
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }
}
