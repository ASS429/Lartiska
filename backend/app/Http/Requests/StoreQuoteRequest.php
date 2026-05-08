<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'client_name' => ['required', 'string', 'max:120'],
            'client_email' => ['required', 'email', 'max:160'],
            'client_phone' => ['required', 'string', 'max:30'],
            'client_city' => ['nullable', 'string', 'max:80'],
            'site_address' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'surface_m2' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'attachments' => ['nullable', 'array', 'max:10'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
        ];
    }
}
