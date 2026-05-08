<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->withCount(['projects' => fn ($q) => $q->where('status', 'published')])
            ->orderBy('order')
            ->get();

        return CategoryResource::collection($categories);
    }
}
