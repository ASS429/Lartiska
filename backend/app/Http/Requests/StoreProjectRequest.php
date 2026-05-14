<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'city' => ['nullable', 'string', 'max:120'],
            'client_name' => ['nullable', 'string', 'max:120'],
            'materials' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:120'],
            'completed_at' => ['nullable', 'date'],
            'status' => ['nullable', Rule::in(['draft', 'published'])],
            'featured' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
