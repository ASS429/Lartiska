<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::active()->with('category');

        if ($category = $request->string('category')->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        // Regroupés par MÉTIER (ordre des catégories : plafonnage, peinture,
        // menuiserie…), puis par ordre/titre à l'intérieur de chaque métier —
        // sinon la page Services mélange tous les métiers.
        return ServiceResource::collection(
            $query
                ->orderBy(
                    Category::select('order')->whereColumn('categories.id', 'services.category_id')
                )
                ->orderBy('order')
                ->orderBy('title')
                ->get()
        );
    }
}
