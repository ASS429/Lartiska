<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // uncompromised() vérifie contre les fuites connues (haveibeenpwned,
        // via k-anonymity : le mot de passe n'est jamais envoyé en clair).
        // Uniquement en production : appel réseau inutile en local/tests.
        $password = Password::min(10)->letters()->numbers();
        if (app()->environment('production')) {
            $password = $password->uncompromised();
        }

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'password' => ['required', 'confirmed', $password],
            'phone' => ['nullable', 'string', 'max:30'],
            'device_name' => ['nullable', 'string', 'max:80'],
        ];
    }
}
