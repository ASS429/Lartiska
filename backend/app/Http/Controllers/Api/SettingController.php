<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function publicSettings(): JsonResponse
    {
        $settings = Setting::public()->get()->mapWithKeys(
            fn (Setting $s) => [$s->key => $s->value],
        );

        return response()->json(['data' => $settings]);
    }
}
