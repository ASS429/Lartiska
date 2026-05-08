<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuoteStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['pending', 'processing', 'sent', 'accepted', 'rejected', 'expired'])],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
