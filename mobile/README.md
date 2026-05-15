# Lartiska Mobile

App iOS / Android pour les clients de Lartiska — consultation portfolio,
demande de devis, suivi des demandes, validation d'un devis.

Stack : **Expo SDK 54 · React Native 0.81 · Expo Router 6 · TanStack Query · Zustand · AsyncStorage**.

## Démarrage en local

### 1. Variables d'environnement

```bash
cp .env.example .env.local
```

Édite `.env.local` :

- **Trouve l'IP de ta machine sur le Wi-Fi** :
  - Windows : `ipconfig` → "Adresse IPv4"
  - Mac/Linux : `ifconfig` ou `ip addr`
- Mets-la dans `EXPO_PUBLIC_API_URL=http://<TA_IP>:8000/api`
- Ton téléphone doit être sur le **même Wi-Fi** que ton ordi.

### 2. Lancer le backend en mode "réseau"

Le backend doit écouter sur toutes les interfaces, pas seulement localhost :

```bash
cd ../backend
php artisan serve --host=0.0.0.0 --port=8000
```

### 3. Lancer l'app

```bash
cd mobile
npm install      # première fois uniquement
npx expo start
```

Un QR code apparaît dans le terminal.

### 4. Scanner avec Expo Go

- **Android** : installe **Expo Go** depuis le Play Store → scanner le QR
- **iPhone** : installe **Expo Go** depuis l'App Store → ouvrir Caméra → scanner le QR
- L'app s'ouvre dans Expo Go en quelques secondes

## Arborescence

```
mobile/
├── app/                       # Expo Router (file-based)
│   ├── _layout.tsx           # Layout root : QueryClient + Theme + Stack
│   ├── (tabs)/               # Tab navigation
│   │   ├── _layout.tsx       # Tabs : Accueil / Portfolio / Devis / Compte
│   │   ├── index.tsx         # Accueil (hero + services + portfolio teaser)
│   │   ├── portfolio.tsx     # Grille filtres ville+cat
│   │   ├── devis.tsx         # Formulaire de devis
│   │   └── account.tsx       # Mes demandes (auth required)
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── project/[slug].tsx    # Détail projet + actions (WhatsApp, "Je veux pareil")
│   └── quote/[id].tsx        # Détail devis client + accepter/refuser
├── src/
│   ├── api/
│   │   ├── client.ts         # Axios + Bearer token
│   │   └── endpoints.ts      # Toutes les routes typées
│   └── store/
│       └── auth.ts           # Zustand : user, login, register, logout, hydrate
├── constants/theme.ts        # Tokens couleurs / spacing / font
└── assets/                   # Icônes Expo par défaut
```

## Connexion au backend

L'app utilise les mêmes endpoints que `web/` :

- `POST /api/auth/login` — connexion (token Sanctum stocké via AsyncStorage)
- `POST /api/auth/register` — inscription client (claim auto des devis invités par email)
- `GET /api/projects` — portfolio public (filtres `?city`, `?category`)
- `GET /api/projects/cities` — liste villes
- `POST /api/quotes` — nouvelle demande (en invité ou connecté)
- `GET /api/account/quotes` — mes devis
- `POST /api/account/quotes/{id}/respond` — accepter/refuser/demander une modif

## Ce que l'app fait

- Accueil avec hero, services et portfolio teaser horizontal
- Portfolio filtrable par catégorie + ville (sourcé du backend)
- Détail projet avec galerie miniatures + partage WhatsApp natif
- Bouton "✦ Je veux pareil" qui pré-remplit le devis avec la bonne catégorie
- Demande de devis simple (1 page) avec sélection service
- Connexion / inscription en mode modal
- Espace client : liste des devis, badges de statut colorés
- Détail d'un devis : accepter / refuser / demander une modification
- WhatsApp direct (premier numéro Lartiska) depuis l'accueil

## Limitations connues (à finir plus tard)

- **PDF devis** : ouverture redirige vers le site web (téléchargement avec auth
  Bearer non trivial en RN — viendra avec `expo-file-system`).
- **Upload photos** sur le formulaire devis : pas encore (mobile/web ont des
  flux différents pour `react-native-image-picker` / `expo-image-picker`).
- **Notifications push** : pas encore (nécessite EAS Build + projet Expo
  enregistré).
- **Offline cache** : pas encore (MMKV ou React Query persister).

## Build prod

Build EAS (Expo Application Services) — gratuit pour le 1er build :

```bash
npm install -g eas-cli
eas login
eas build --profile preview --platform android   # APK testable
eas build --profile production --platform all    # iOS + Android stores
```
