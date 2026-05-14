<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $settings = Setting::orderBy('group')->orderBy('key')->get();

        // Format groupé : { company: { ... }, contact: { ... }, social: { ... } }
        $grouped = $settings->groupBy('group')->map(
            fn ($items) => $items->keyBy('key')->map->value
        );

        return response()->json([
            'data' => $grouped,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => ['required', 'array'],
        ]);

        $updated = [];

        foreach ($request->input('settings', []) as $key => $value) {
            // Filet de sécurité : ne jamais permettre de réécrire le rôle/groupe par ce endpoint
            $setting = Setting::where('key', $key)->first();
            if (!$setting) continue;

            $setting->value = $value;
            $setting->save();
            $updated[] = $key;
        }

        return response()->json([
            'message' => count($updated) . ' réglage(s) mis à jour.',
            'updated_keys' => $updated,
        ]);
    }
}
