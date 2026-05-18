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
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
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

    /**
     * Envoie un email de réinitialisation de mot de passe.
     * On retourne TOUJOURS un succès (200) même si l'email n'existe pas,
     * pour éviter l'énumération des comptes.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Password::sendResetLink déclenche notre notification custom
        // (configurée dans AppServiceProvider) qui pointe vers le frontend React.
        Password::sendResetLink(['email' => $request->string('email')->toString()]);

        return response()->json([
            'message' => 'Si cette adresse correspond à un compte, un lien vient d\'être envoyé.',
        ]);
    }

    /**
     * Définit un nouveau mot de passe à partir du token reçu par email.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => __($status),
            ]);
        }

        return response()->json([
            'message' => 'Mot de passe réinitialisé. Vous pouvez maintenant vous connecter.',
        ]);
    }
}
