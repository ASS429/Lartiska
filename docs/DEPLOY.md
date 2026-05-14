# Déploiement Lartiska — Production

Architecture de prod :

```
  Visiteur
     │
     ▼
  lartiska.onrender.com  ──── Render Static Site ──── web/dist (React build)
     │
     │ XHR /api/*
     ▼
  lartiska-api.railway.app ── Railway Web Service ── backend/ (Laravel)
     │
     ├── MySQL (Railway add-on)
     └── Storage images ──── Cloudflare R2 (bucket lartiska-media)
```

Trois étapes, dans cet ordre. Compter ~45 min au total.

---

## ÉTAPE 1 — Cloudflare R2 (stockage images)

R2 héberge les photos uploadées depuis l'admin Tounkara. 10 GB gratuit, pas de frais d'egress.

### 1.1 Créer le bucket
1. Compte Cloudflare → [dashboard R2](https://dash.cloudflare.com/?to=/:account/r2)
2. **Create bucket** → nom : `lartiska-media` → Location: Automatic
3. Onglet **Settings** du bucket → activer **Public access** (R2.dev subdomain)
   → tu obtiens une URL `https://pub-XXXXXXXX.r2.dev`

### 1.2 Créer les clés API
1. R2 dashboard → **Manage R2 API Tokens** → **Create API token**
2. Permissions : **Object Read & Write**
3. Scope : sélectionner le bucket `lartiska-media`
4. **Create** → noter immédiatement :
   - **Access Key ID** (visible une seule fois)
   - **Secret Access Key**
   - **Endpoint** (format : `https://<account_id>.r2.cloudflarestorage.com`)

### 1.3 CORS (autoriser uploads depuis Railway)
Bucket → onglet **Settings** → **CORS Policy** → coller :

```json
[
  {
    "AllowedOrigins": ["https://lartiska.onrender.com", "https://*.railway.app"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

À garder sous la main pour l'étape Railway :
- `R2_ACCESS_KEY_ID = …`
- `R2_SECRET_ACCESS_KEY = …`
- `R2_BUCKET = lartiska-media`
- `R2_ENDPOINT = https://<account_id>.r2.cloudflarestorage.com`
- `R2_PUBLIC_URL = https://pub-XXXXXXXX.r2.dev`

---

## ÉTAPE 2 — Railway (backend Laravel + MySQL)

### 2.1 Créer le projet
1. [railway.app](https://railway.app) → login GitHub
2. **New Project** → **Deploy from GitHub repo** → `ASS429/Lartiska`
3. Une fois le repo connecté, ouvrir le service créé :
   - **Settings** → **Root Directory** : `backend`
   - **Settings** → **Build Command** : *(laisser vide, Nixpacks détecte)*
   - **Settings** → **Start Command** : *(laisser vide, `nixpacks.toml` gère)*

### 2.2 Ajouter MySQL
1. Dans le projet Railway → **New** → **Database** → **MySQL**
2. Railway crée automatiquement les variables `MYSQL_*`. On va les mapper.

### 2.3 Variables d'environnement
Dans le service backend, onglet **Variables**, ajouter :

```bash
# Application
APP_NAME=Lartiska
APP_ENV=production
APP_DEBUG=false
APP_KEY=                          # généré par railway-start.sh au 1er deploy
APP_TIMEZONE=Africa/Dakar
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}} # auto-rempli par Railway
APP_LOCALE=fr

# Base de données (référence le service MySQL)
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# Cache / Queue / Session — sur la BDD pour éviter Redis
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database

# Storage — Cloudflare R2
FILESYSTEM_DISK=r2
R2_ACCESS_KEY_ID=…                # depuis étape 1.2
R2_SECRET_ACCESS_KEY=…
R2_BUCKET=lartiska-media
R2_REGION=auto
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-XXXXXXXX.r2.dev

# CORS + Sanctum — allow-list stricte
FRONTEND_URL=https://lartiska.onrender.com
FRONTEND_EXTRA_ORIGINS=       # vide ; ajouter "https://staging.lartiska.com" si besoin
SANCTUM_STATEFUL_DOMAINS=lartiska.onrender.com

# Admin initial (lu par UserSeeder au 1er deploy)
# OBLIGATOIRE en prod — sinon un mot de passe aléatoire est généré et loggé.
ADMIN_DEFAULT_EMAIL=tounkara@lartiska.com
ADMIN_DEFAULT_NAME=Tounkara
ADMIN_DEFAULT_PHONE=+221785446363
ADMIN_DEFAULT_PASSWORD=                # ⚠ générer une chaîne forte (32+ chars)

# Mail — Resend SMTP (free : 3 000 emails/mois). Pas de paquet Composer supplémentaire.
# resend.com → API Keys → créer → coller la clé dans MAIL_PASSWORD
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_USERNAME=resend
MAIL_PASSWORD=re_xxxxxxxxxxxxxxxxx
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=contact@lartiska.com
MAIL_FROM_NAME=Lartiska
MAIL_ADMIN_NOTIFY=tounkara@lartiska.com   # qui reçoit les notifs nouveau devis

# Log
LOG_CHANNEL=stderr
LOG_LEVEL=warning
```

### 2.4 Premier déploiement
1. **Deployments** → Railway lance automatiquement le build dès que les vars sont posées
2. Suivre les logs : `composer install`, `php artisan config:cache`, `migrate`, `serve`
3. Si OK, copier l'URL **public** générée par Railway (style `lartiska-api-production.up.railway.app`)

### 2.5 Seeder la BDD (1 seule fois)
Onglet **Settings** → **Service Variables** → temporairement régler `APP_ENV=local` pour autoriser `--seed`,
ou plus simplement utiliser la **Railway CLI** :

```bash
# Sur ta machine
npm install -g @railway/cli
railway login
railway link              # sélectionner le projet
railway run --service backend php artisan db:seed --force
```

Cela exécute le seeder (admin Tounkara + 4 catégories + 6 services + settings + 8 projets fake + 8 avis).

---

## ÉTAPE 3 — Render (vitrine React)

### 3.1 Configurer le service existant

L'ancien site Render servait `index.html` à la racine. On bascule sur le build React.

1. Render dashboard → service **lartiska** (ou similaire) → **Settings**
2. **Root Directory** : `web`
3. **Build Command** : `npm ci && npm run build`
4. **Publish Directory** : `web/dist`
5. **Environment** :
   - `NODE_VERSION` = `22.17.1`
   - `VITE_API_BASE_URL` = `https://lartiska-api-production.up.railway.app/api`
     *(remplacer par l'URL Railway de l'étape 2.4)*

### 3.2 Auto-deploy
**Settings** → **Auto-Deploy** : `Yes` sur la branche `main`.

À partir de maintenant, chaque `git push origin main` :
- → re-build React (Render) avec la dernière `VITE_API_BASE_URL`
- → re-deploy Laravel (Railway) avec les dernières migrations

### 3.3 SPA routing
Le `render.yaml` (à la racine du repo) contient déjà :

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

Render appliquera cette règle automatiquement à la prochaine deploy (sinon : Settings → Redirects/Rewrites → ajouter manuellement).

---

## ÉTAPE 4 — Smoke test prod

Une fois les 3 services en ligne :

```bash
# Backend health
curl https://lartiska-api-production.up.railway.app/api/health
# → {"status":"ok","app":"Lartiska","time":"…"}

# Liste publique des projets
curl https://lartiska-api-production.up.railway.app/api/projects | jq '.data | length'
# → 8

# Login admin
curl -X POST https://lartiska-api-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tounkara@lartiska.com","password":"lartiska2026"}'
```

Puis ouvrir `https://lartiska.onrender.com` dans le navigateur :
- Hero charge ✅
- `/portfolio` affiche les 8 projets seedés ✅
- Devis : soumission marche jusqu'au "Merci" ✅
- `/admin` redirige vers `/login`, le login admin fonctionne ✅

---

## ÉTAPE 5 — Configuration post-prod

### Changer le mot de passe admin
Tout de suite après le premier login : **/admin/settings** *(à venir)* ou via Railway CLI :

```bash
railway run --service backend php artisan tinker
# >>> User::where('email','tounkara@lartiska.com')->first()->update(['password' => Hash::make('NOUVEAU')])
```

### Brancher Resend pour les emails
- [resend.com](https://resend.com) → free 3 000 emails/mois
- Settings → API Keys → créer une clé
- Railway → ajouter :
  ```
  MAIL_MAILER=resend
  MAIL_FROM_ADDRESS=contact@lartiska.com
  RESEND_KEY=re_xxx
  ```
- Installer le driver côté Laravel : `composer require resend/resend-laravel`

### Domaine custom (plus tard)
- Acheter `lartiska.com` (Namecheap ~10 €/an)
- Render → Settings → **Custom Domains** → ajouter `lartiska.com`
- Railway → Settings → **Domains** → ajouter `api.lartiska.com`
- Mettre à jour DNS chez le registrar (CNAME → render, A → railway)
- Mettre à jour les variables : `VITE_API_BASE_URL=https://api.lartiska.com/api`, `FRONTEND_URL=https://lartiska.com`

---

## Dépannage

**Le build Railway échoue à `composer install`** : vérifier que `backend/composer.json` est commité et que la **Root Directory** est bien `backend`.

**Erreur "APP_KEY not set"** : ouvrir le service Railway → **Variables** → ajouter manuellement `APP_KEY=` puis lancer `railway run --service backend php artisan key:generate --show` pour récupérer une clé à coller.

**CORS error sur Render** : vérifier que `FRONTEND_URL` côté Railway pointe bien vers `https://lartiska.onrender.com` (sans trailing slash). Vérifier `config/cors.php` accepte les patterns `*.onrender.com`.

**Images uploadées invisibles** : vérifier que le bucket R2 est en **Public access** et que `R2_PUBLIC_URL` est correct. Tester un upload depuis `/admin/projects/X` puis cliquer sur l'image.

**Migrations qui ne tournent pas** : `railway run --service backend php artisan migrate --force` manuellement.
