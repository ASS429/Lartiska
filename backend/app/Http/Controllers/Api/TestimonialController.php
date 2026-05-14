<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $testimonials = Testimonial::published()
            ->with('project:id,title,slug')
            ->orderBy('order')
            ->limit($request->integer('limit', 12))
            ->get();

        return TestimonialResource::collection($testimonials);
    }
}
