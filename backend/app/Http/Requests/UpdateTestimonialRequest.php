<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['sometimes', 'string', 'max:120'],
            'client_role' => ['sometimes', 'nullable', 'string', 'max:120'],
            'city' => ['sometimes', 'nullable', 'string', 'max:120'],
            'project_id' => ['sometimes', 'nullable', 'exists:projects,id'],
            'content' => ['sometimes', 'string', 'max:2000'],
            'rating' => ['sometimes', 'nullable', 'integer', 'between:1,5'],
            'is_published' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
