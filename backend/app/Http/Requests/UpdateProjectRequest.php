<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $projectId = $this->route('project')?->id;

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($projectId)],
            'description' => ['sometimes', 'nullable', 'string'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'city' => ['sometimes', 'nullable', 'string', 'max:120'],
            'client_name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'materials' => ['sometimes', 'nullable', 'string', 'max:255'],
            'duration' => ['sometimes', 'nullable', 'string', 'max:120'],
            'completed_at' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'featured' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
