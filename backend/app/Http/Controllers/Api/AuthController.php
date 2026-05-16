<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->string('name'),
            'email' => $request->string('email'),
            'password' => $request->string('password'),
            'phone' => $request->string('phone'),
            'role' => 'client',
        ]);

        // ─── Pas de claim automatique des devis invités ────────────────
        // L'ancienne logique récupérait tous les devis Quote(user_id=null,
        // client_email=user.email) au moment du register. Vulnérabilité :
        // sans email verification, n'importe qui pouvait s'inscrire avec
        // l'email d'une victime et lire ses devis (adresse, photos, etc.).
        //
        // On compte juste les devis "en attente d'appariement" pour
        // afficher un message au user → il pourra demander à Tounkara
        // de les rattacher manuellement via l'admin.
        $pendingCount = Quote::whereNull('user_id')
            ->where('client_email', $user->email)
            ->count();

        $token = $user->createToken($request->string('device_name', 'web'))->plainTextToken;

        return response()->json([
            'data' => $user,
            'token' => $token,
            'pending_quotes_to_claim' => $pendingCount,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->string('email'))->first();

        if (!$user || !Hash::check($request->string('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken($request->string('device_name', 'web'))->plainTextToken;

        return response()->json([
            'data' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->user()]);
    }
}
