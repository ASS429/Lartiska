<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $serviceId = $this->route('service')?->id;

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('services', 'slug')->ignore($serviceId)],
            'description' => ['sometimes', 'nullable', 'string'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'price_from' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_to' => ['sometimes', 'nullable', 'numeric', 'min:0', 'gte:price_from'],
            'unit' => ['sometimes', 'nullable', Rule::in(['m2', 'forfait', 'jour', 'piece'])],
            'icon' => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
