<x-mail::message>
# ✦ Nouvelle demande de devis

**Référence** : {{ $quote->reference }}
**Reçu le** : {{ $quote->created_at->format('d/m/Y à H:i') }}

---

## Client
- **Nom** : {{ $quote->client_name }}
- **Email** : {{ $quote->client_email }}
- **Téléphone** : {{ $quote->client_phone }}
@if ($quote->client_city)
- **Ville** : {{ $quote->client_city }}
@endif
@if ($quote->site_address)
- **Adresse chantier** : {{ $quote->site_address }}
@endif

## Projet
@if ($quote->service)
- **Service demandé** : {{ $quote->service->title }}
@endif
@if ($quote->surface_m2)
- **Surface** : {{ $quote->surface_m2 }} m²
@endif
@if ($quote->estimated_budget)
- **Budget annoncé** : {{ number_format((float) $quote->estimated_budget, 0, ',', ' ') }} FCFA
@endif

@if ($quote->description)
**Description** :

> {{ $quote->description }}
@endif

@if ($quote->attachments && count($quote->attachments))
**Pièces jointes** : {{ count($quote->attachments) }} fichier(s) — à consulter depuis l'admin
@endif

<x-mail::button :url="config('app.frontend_url', 'https://lartiska.onrender.com') . '/admin/quotes/' . $quote->id">
Ouvrir dans l'admin
</x-mail::button>

Réponse client recommandée sous 24h.

<x-slot:subcopy>
Notification automatique Lartiska. Tu peux contacter le client directement via WhatsApp : [{{ $quote->client_phone }}](https://wa.me/{{ preg_replace('/[^0-9]/', '', $quote->client_phone) }})
</x-slot:subcopy>
</x-mail::message>
