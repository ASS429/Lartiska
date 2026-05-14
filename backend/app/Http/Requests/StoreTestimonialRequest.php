<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:120'],
            'client_role' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'string', 'max:120'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'content' => ['required', 'string', 'max:2000'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'is_published' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
