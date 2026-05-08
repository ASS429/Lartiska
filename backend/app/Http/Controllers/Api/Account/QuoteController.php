<?php

namespace App\Http\Controllers\Api\Account;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuoteResource;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $quotes = $request->user()
            ->quotes()
            ->with('service:id,title,unit')
            ->latest()
            ->paginate(15);

        return QuoteResource::collection($quotes);
    }
}
