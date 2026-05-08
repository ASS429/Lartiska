# Lartiska — Plateforme digitale

Monorepo de la plateforme **Lartiska** (artiste Tounkara) : site vitrine, application mobile et API.

🌍 **Site live (vitrine v0)** : <https://lartiska.onrender.com>
📁 **Repo GitHub** : <https://github.com/ASS429/Lartiska>

---

## Structure du monorepo

```
lartiska/
├── backend/      → Laravel 11 + Sanctum (API REST + admin)
├── web/          → React 19 + Vite + Tailwind (futur site vitrine)
├── mobile/       → React Native + Expo (app iOS/Android)
├── shared/       → Types TypeScript et utilitaires partagés
├── docs/         → Wireframes, contrats, documentation
├── .github/      → Workflows CI/CD
├── index.html    → Site vitrine v0 actuel (servi par Render)
└── villes/       → Médias des chantiers
```

Tant que la nouvelle vitrine React n'est pas prête, **`index.html` à la racine reste la version en production** sur Render. La refonte vivra dans `web/`.

---

## 🚀 Démarrage rapide — Backend (Laravel 11)

Prérequis : PHP 8.2+, Composer 2.x.
SQLite est utilisé par défaut (aucun setup MySQL requis pour démarrer).

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite        # PowerShell : New-Item database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve                     # http://127.0.0.1:8000
```

### Compte admin par défaut (seedé)

| Champ    | Valeur                       |
|----------|------------------------------|
| Email    | `tounkara@lartiska.com`      |
| Password | `lartiska2026`               |
| Rôle     | `admin`                      |

À changer en production.

### Endpoints API exposés (v1)

| Méthode | Endpoint                  | Description                                  |
|---------|---------------------------|----------------------------------------------|
| GET     | `/api/health`             | Healthcheck                                  |
| POST    | `/api/auth/register`      | Inscription client                           |
| POST    | `/api/auth/login`         | Connexion → token Sanctum                    |
| POST    | `/api/auth/logout`        | Révocation token (auth)                      |
| GET     | `/api/auth/me`            | Profil courant (auth)                        |
| GET     | `/api/categories`         | Liste des catégories actives                 |
| GET     | `/api/projects`           | Portfolio paginé (filtre `category`, `featured`) |
| GET     | `/api/projects/{slug}`    | Détail projet + galerie                      |
| GET     | `/api/services`           | Liste des services + tarifs                  |
| POST    | `/api/quotes`             | Soumettre une demande de devis (rate-limité) |
| GET     | `/api/quotes/{id}`        | Voir un devis (auth, propriétaire ou admin)  |
| POST    | `/api/contact`            | Envoyer un message de contact                |
| GET     | `/api/social/feed`        | Feed des posts sociaux synchronisés          |
| GET     | `/api/settings/public`    | Réglages publics (téléphone, socials, etc.)  |

---

## 🧱 Schéma de base de données

12 tables : `users`, `categories`, `projects`, `project_images`, `services`, `quotes`, `quote_items`, `contracts`, `messages`, `social_posts`, `settings`, `activity_logs`.
Détails dans `Lartiska_Projet_Complet.docx` (section 3.2).

---

## 🛠️ Stack & dépendances

**Backend** : Laravel 11.31 · Laravel Sanctum · Barryvdh DomPDF · Intervention Image · MySQL/SQLite
**Web** *(à venir)* : React 19 · Vite · Tailwind · Axios · TanStack Query
**Mobile** *(à venir)* : React Native · Expo · NativeWind

---

## 📞 Contact

- WhatsApp : [+221 78 544 63 63](https://wa.me/221785446363)
- Instagram : [@lartiska_officiel](https://instagram.com/lartiska_officiel)
- TikTok : [@lartiska](https://www.tiktok.com/@lartiska)
