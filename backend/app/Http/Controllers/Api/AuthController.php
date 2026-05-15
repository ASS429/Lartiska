<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Quote;
use App\Models\User;
use App\Services\ActivityLogger;
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

        // Récupérer les devis créés en invité avec le même email → les associer au nouveau compte
        $claimed = Quote::whereNull('user_id')
            ->where('client_email', $user->email)
            ->update(['user_id' => $user->id]);

        if ($claimed > 0) {
            ActivityLogger::log('quotes.claimed_on_register', $user, [
                'count' => $claimed,
            ]);
        }

        $token = $user->createToken($request->string('device_name', 'web'))->plainTextToken;

        return response()->json([
            'data' => $user,
            'token' => $token,
            'claimed_quotes' => $claimed,
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
