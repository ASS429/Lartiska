<x-mail::message>
# Bonjour {{ explode(' ', $quote->client_name)[0] }},

Voici **votre devis Lartiska** — référence **{{ $quote->reference }}**.

Vous trouverez en pièce jointe le document détaillé. N'hésitez pas à nous écrire pour toute question, modification ou validation.

@if ($quote->total_amount)
**Montant estimé** : {{ number_format((float) $quote->total_amount, 0, ',', ' ') }} FCFA
@endif

@if ($quote->service)
**Prestation** : {{ $quote->service->title }}
@endif

@if ($quote->surface_m2)
**Surface** : {{ $quote->surface_m2 }} m²
@endif

<x-mail::button :url="config('app.frontend_url', 'https://lartiska.onrender.com') . '/account'">
Accéder à mon espace
</x-mail::button>

Vous pouvez aussi nous joindre directement :

- **WhatsApp** : [+221 78 544 63 63](https://wa.me/221785446363)
- **Email** : [contact@lartiska.com](mailto:contact@lartiska.com)

Merci de votre confiance,<br>
**Tounkara**<br>
Fondateur — Lartiska

<x-slot:subcopy>
*émeraude · or · pièce signature* — Ce devis est valable 30 jours à compter de sa date d'émission.
</x-slot:subcopy>
</x-mail::message>
