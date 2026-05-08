<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'quote_id',
        'total_amount',
        'deposit_amount',
        'balance_amount',
        'start_date',
        'expected_end_date',
        'completed_at',
        'signature_path',
        'signed_pdf_path',
        'signature_token',
        'token_expires_at',
        'signed_at',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'completed_at' => 'date',
        'token_expires_at' => 'datetime',
        'signed_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'draft',
    ];

    protected static function booted(): void
    {
        static::creating(function (Contract $contract) {
            if (empty($contract->reference)) {
                $year = now()->year;
                $next = (static::whereYear('created_at', $year)->count() + 1);
                $contract->reference = sprintf('CONT-%d-%04d', $year, $next);
            }
            if (empty($contract->signature_token)) {
                $contract->signature_token = Str::random(64);
                $contract->token_expires_at = now()->addDays(15);
            }
        });
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }
}
