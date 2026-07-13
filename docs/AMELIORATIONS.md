# Lartiska — Plan d'améliorations complet

> **Mise à jour 05/07/2026 — état d'avancement.** Les Phases 1 et 2 sont **implémentées**, la Phase 3 l'est en **v1** :
> - ✅ **Phase 1 (sécurité)** : expiration tokens Sanctum (14 j) + purge quotidienne · middleware SecurityHeaders (X-Frame-Options, nosniff, HSTS, CSP, Permissions-Policy) · HTTPS forcé en prod · ré-encodage WebP + strip EXIF/GPS des uploads (`ImageProcessor`) · mots de passe min 10 + `uncompromised()` · révocation de tous les tokens au reset password · throttle admin (120/min, upload 20/min) · auth store web nettoyé (token seul, plus de user persisté).
> - ✅ **Phase 2 (performance)** : vidéos lazy (`LazyVideo` + SectionWipe différé, preload none, pause hors écran) · vignettes 640px (`cover_thumbnail`, migration + resource + grilles front) · code-splitting admin/légal/account (React.lazy) · honeypot devis + contact (front + back).
> - ✅ **Phase 3 v1 (cinématique)** : Lenis smooth scroll synchronisé GSAP ScrollTrigger · reveals masqués des titres + cascade des cartes (`CinematicEffects`) · tilt 3D + reflet doré des cartes projet · boutons magnétiques · coup de pinceau doré animé sous le titre hero (`BrushStroke`) · poussière d'or ambiante (`GoldDust`, remplace PaintDrops) · brouillon localStorage du devis. Tout est gardé par `prefers-reduced-motion` et désactivé au tactile quand pertinent.
> - ⏳ **Restant** : compression des MP4 (nécessite ffmpeg) · stockage R2/CDN · scrollytelling 3D « Du brut à l'œuvre » et section epoxy R3F (Phase 4) · compteurs animés (en attente des vrais chiffres clés) · tests/Sentry/uptime/2FA (Phase 5).
> - ⚠️ **Actions serveur à ta charge** : lancer `php artisan migrate` sur Railway (colonne `cover_thumbnail`) · vérifier `APP_ENV=production` + `APP_DEBUG=false` · s'assurer que le scheduler tourne (`php artisan schedule:run` en cron) pour la purge des tokens.

> Document d'analyse et de recommandations d'origine ci-dessous.
> Analyse effectuée sur : `backend/` (Laravel 11 + Sanctum), `web/` (React 19 + Vite + Tailwind), `mobile/` (Expo + React Native), déploiement Render + Railway.

**Légende priorités :** 🔴 Critique (à faire avant/dès la mise en prod réelle) · 🟠 Important (dans les semaines qui suivent) · 🟢 Bonus (confort, différenciation)

---

## 1. État des lieux — ce qui est déjà bien

Avant de lister ce qui manque, il faut noter ce qui est déjà solide (à ne pas casser) :

- **CORS strict** : allow-list explicite, regex limitées aux domaines `lartiska.com` / `lartiska.art`, Render/Railway volontairement exclus des patterns.
- **Rate limiting** sur les routes sensibles : `throttle:10,1` sur login/register, `throttle:5,1` sur forgot/reset password, devis et contact.
- **Anti-énumération de comptes** : `forgotPassword` répond toujours 200, message neutre.
- **Vulnérabilité de "claim" des devis invités corrigée** : plus de rattachement automatique des devis par email à l'inscription (bien documenté dans le code).
- **Upload d'images validé** : `image`, `mimes:jpeg,jpg,png,webp`, `max:10240`, max 20 fichiers.
- **Séparation des rôles** : middleware `admin` sur `/api/admin/*`, espace client séparé (`/api/account/*`).
- **Architecture propre** : FormRequests, Resources, contrôleurs séparés public/account/admin, seeders.
- **Frontend structuré** : React Query pour le cache serveur, Zustand pour l'auth, hydratation propre du token, SEO travaillé (balises, JSON-LD FAQPage/BusinessSchema).

---

## 2. Améliorations SÉCURITÉ

### 2.1 Backend (Laravel)

| Prio | Amélioration | Détail |
|---|---|---|
| 🔴 | **Expiration des tokens Sanctum** | `config/sanctum.php` → `'expiration' => null` : un token volé est valable **à vie**. Mettre une expiration (ex. 7–30 jours) + rotation : ré-émettre un token à chaque `me()` proche de l'expiration, et purger les tokens expirés (tâche planifiée `sanctum:prune-expired`). |
| 🔴 | **Headers de sécurité HTTP** | Aucun middleware de headers trouvé. Ajouter un middleware global qui pose : `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/micro off), `Strict-Transport-Security` (HSTS) en prod, et une **Content-Security-Policy** au moins sur les réponses non-API. |
| 🔴 | **Forcer HTTPS en production** | `URL::forceScheme('https')` dans `AppServiceProvider` quand `app()->environment('production')` + `APP_URL` en https. Render fait du TLS en frontal, mais les URLs générées (liens PDF, reset password) doivent être https. |
| 🔴 | **Retraitement des images uploadées** | La validation `mimes:` ne suffit pas : un fichier peut être une image valide **et** contenir une charge utile (polyglotte). Ré-encoder chaque image côté serveur (Intervention Image / GD) : redimensionner (ex. max 2560px), recompresser, **supprimer les métadonnées EXIF** (les photos de chantier prises au téléphone contiennent souvent les **coordonnées GPS du domicile des clients** — fuite de vie privée réelle). |
| 🟠 | **Vérification d'email** | Pas d'email verification à l'inscription. La rattacher (Laravel `MustVerifyEmail`) permettrait aussi de réactiver le rattachement automatique des devis invités en toute sécurité (le problème d'origine documenté dans `AuthController`). |
| 🟠 | **Renforcer la politique de mot de passe** | `Password::min(8)` seul. Passer à `Password::min(10)->letters()->mixedCase()->numbers()->uncompromised()` (le `uncompromised()` vérifie contre les fuites connues via k-anonymity, sans envoyer le mot de passe). |
| 🟠 | **Rate limiting sur l'espace admin** | Les mutations admin (`POST/PATCH/DELETE`) n'ont pas de throttle. Ajouter un `throttle:60,1` global sur `/api/admin/*` et un plus strict sur l'upload d'images. |
| 🟠 | **Journal d'audit admin** | Aucune trace de qui a modifié quoi. Table `audit_logs` (user_id, action, modèle, diff JSON, IP, date) alimentée par un observer sur Project/Service/Quote/Setting. Indispensable le jour où un devis est contesté. |
| 🟠 | **Verrouillage de compte progressif** | Le throttle limite par IP, mais pas par compte. Après N échecs de connexion sur un même email : délai croissant + notification email au titulaire. |
| 🟠 | **Invalidation des tokens au reset password** | Vérifier que `resetPassword` supprime tous les `personal access tokens` existants de l'utilisateur (`$user->tokens()->delete()`) — sinon un attaquant déjà connecté garde l'accès après que la victime a changé son mot de passe. |
| 🟢 | **2FA pour le compte admin** | Un seul compte admin contrôle tout le site. TOTP (Google Authenticator) via un package type `pragmarx/google2fa` — même juste pour le rôle `admin`. |
| 🟢 | **Sauvegardes automatiques de la base Railway** | Vérifier/activer les backups Railway + un dump hebdomadaire exporté hors Railway (les photos clients et devis sont irremplaçables). Documenter la procédure de restauration. |
| 🟢 | **Scan des dépendances** | Activer Dependabot (GitHub) sur `backend/composer.json`, `web/package.json`, `mobile/package.json` + `composer audit` / `npm audit` dans la CI. |

### 2.2 Frontend (web)

| Prio | Amélioration | Détail |
|---|---|---|
| 🟠 | **Stockage du token** | Le token vit en `localStorage` (double : `lartiska_token` + persist Zustand `lartiska_auth`) → exposé à tout XSS. Idéal : basculer sur les **cookies httpOnly de Sanctum (mode SPA stateful)**. À défaut, garder localStorage mais : supprimer la duplication (une seule source), réduire la durée de vie du token côté serveur, et durcir le front contre XSS (voir CSP ci-dessus). |
| 🟠 | **Nettoyage des données persistées** | Le persist Zustand garde `user` en localStorage : des infos personnelles restent sur les machines partagées après expiration. Ne persister que le token, re-fetch `me()` au chargement (déjà fait par `hydrate`). |
| 🟢 | **Protection anti-spam des formulaires publics** | Devis + contact sont throttlés côté serveur, mais rien côté bot. Ajouter un honeypot (champ caché) + temps minimal de remplissage ; éviter les CAPTCHA visuels (friction client). |
| 🟢 | **Page /login admin non différenciée** | L'admin se connecte par le même formulaire que les clients. Envisager une URL admin non devinable ou au minimum ne jamais révéler dans l'UI qu'un compte est admin avant connexion. |

### 2.3 Mobile & infrastructure

| Prio | Amélioration | Détail |
|---|---|---|
| 🟠 | **Stockage du token mobile** | Sur Expo, stocker le token dans **SecureStore** (Keychain/Keystore), jamais dans AsyncStorage. |
| 🟠 | **Variables d'environnement** | Vérifier qu'aucun `.env` n'est commité (le `.gitignore` existe, à auditer) et que `APP_DEBUG=false` + `APP_ENV=production` sur Render — un Laravel en debug expose stack traces et variables. |
| 🟢 | **Certificate pinning (mobile)** | Optionnel pour une v2 : épingler le certificat de l'API dans l'app. |

---

## 3. Améliorations GÉNÉRALES (code, performance, fiabilité)

### 3.1 Performance web (le plus gros chantier)

| Prio | Amélioration | Détail |
|---|---|---|
| 🔴 | **Poids de la page d'accueil** | La home charge **6+ vidéos MP4 en autoplay** (`Lartiska.mp4`, `V1`, `V3`, `V4`, `V5`…, ~10 Mo cumulés) : rédhibitoire sur mobile sénégalais en 3G/4G facturée à la data. → Recompresser en **AV1/H.265 + fallback H.264**, résolutions adaptées (≤720p pour les vignettes), `preload="none"` + lecture au scroll (IntersectionObserver), et **une image poster légère** pour chaque vidéo. Objectif : < 1,5 Mo au premier chargement. |
| 🔴 | **Images du portfolio** | Générer des **variantes de tailles** (thumbnail/medium/large) au moment de l'upload (côté Laravel, en même temps que le ré-encodage sécurité §2.1) + servir en **WebP/AVIF** + `srcset`/`sizes` + `loading="lazy"` partout. Aujourd'hui les originaux (jusqu'à 10 Mo) partent tels quels au navigateur. |
| 🟠 | **CDN pour les médias** | Render sert les fichiers depuis le disque de l'app. Passer les médias sur un stockage objet (Cloudflare R2 — gratuit jusqu'à 10 Go, sans frais de sortie) derrière le CDN Cloudflare. Bonus : les uploads survivent aux redéploiements Render (le disque Render est éphémère → **vérifier d'urgence que les photos uploadées ne disparaissent pas à chaque deploy**). |
| 🟠 | **Code-splitting** | Lazy-loader les pages admin (`React.lazy`) : un visiteur public ne doit pas télécharger le back-office. Idem pour les pages légales. |
| 🟢 | **Budget performance mesuré** | Ajouter Lighthouse CI dans la GitHub Action : LCP < 2,5 s, CLS < 0,1, page < 1,5 Mo. Échec du build si dépassement. |

### 3.2 Qualité & robustesse

| Prio | Amélioration | Détail |
|---|---|---|
| 🟠 | **Tests automatisés** | Aucun test visible. Minimum vital : tests Feature Laravel sur l'auth (login/logout/reset), les policies (un client ne lit pas les devis d'un autre), l'upload, et le flux devis complet. Côté web : quelques tests Vitest sur le store auth et le formulaire de devis. |
| 🟠 | **Monitoring d'erreurs** | Brancher Sentry (offre gratuite) sur les 3 apps (Laravel + React + Expo). Aujourd'hui, si la prod casse un dimanche, personne ne le sait. |
| 🟠 | **Uptime monitoring** | UptimeRobot/BetterStack (gratuit) sur `/api/health` + le frontend, avec alerte email/WhatsApp. Utile aussi pour limiter la mise en veille du plan gratuit Render. |
| 🟠 | **Nettoyage du dépôt** | La racine du repo contient ~10 Mo de fichiers hors-sujet : `*.mp4`, `flyers*.html` (2,8 Mo), `prototype*.html`, `index1.html`, `lartika.html`, `1.jpg`, `Lartiska-main/` (copie du repo !), `lovable/`, `portfolio-new/`. → Déplacer les vidéos utilisées dans `web/public/`, archiver le reste dans une branche `archive` ou un dossier hors git, et alléger le clone. |
| 🟢 | **Emails transactionnels** | Vérifier le provider d'envoi (reset password, devis prêt). En prod, utiliser un service dédié (Resend/Brevo, offres gratuites) avec SPF/DKIM configurés sur le domaine — sinon les emails partent en spam. |
| 🟢 | **Pagination & recherche admin** | Sur la durée, les listes admin (devis, messages, projets) doivent avoir recherche + filtres par statut + tri. |
| 🟢 | **PWA** | Manifest + service worker (cache des pages publiques) : le site devient installable sur Android — utile en attendant l'app mobile, et quasi gratuit à mettre en place. |

---

## 4. Améliorations DESIGN — UI/UX cinématique & 3D réaliste

> **Vision.** Lartiska vend de l'art appliqué aux espaces. Le site doit produire le même effet qu'entrer dans une pièce finie par Tounkara : matière, lumière, profondeur. L'existant (vidéos plein écran, wipes, palette émeraude/or) pose une bonne base « luxe » — l'étape suivante est de passer d'un site *avec des vidéos* à une **expérience mise en scène**, en remplaçant les MP4 lourds par du rendu temps réel (WebGL) plus léger, plus net et interactif.

**Stack recommandée** (tout est compatible avec le projet React 19 + Vite actuel) :
- **GSAP + ScrollTrigger** — chorégraphie du scroll (pin, scrub, timelines).
- **Lenis** — smooth scroll inertiel (la base du feeling cinématique).
- **Three.js via React Three Fiber (R3F) + drei + postprocessing** — scènes 3D réalistes.
- **Framer Motion** — micro-interactions et transitions de pages côté React.

⚠️ **Garde-fous non négociables** (sinon le cinéma tue le business) :
1. Respecter `prefers-reduced-motion` : tout effet a une version statique.
2. Budget : les scènes 3D se chargent en lazy **après** le contenu ; LCP intouché.
3. Fallback mobile bas de gamme : détection GPU (detect-gpu) → version dégradée élégante (image + parallax CSS).
4. Le contenu (services, prix, devis) reste accessible sans aucun effet — les effets décorent, ne portent jamais l'information.

### 4.1 Hero « Atelier vivant » — la première impression 🟠

Remplacer la vidéo MP4 plein écran par une **scène R3F** :
- Un **mur virtuel** en plein écran, matériau PBR réaliste (enduit + plâtre, normal map + roughness map).
- Au chargement : un **coup de pinceau doré traverse le mur** et révèle le titre — shader de reveal (masque animé le long d'une courbe de Bézier, bords irréguliers de vraie peinture, léger relief : la peinture a une épaisseur, une brillance différente du mur).
- La peinture « fraîche » reflète une lumière chaude qui se déplace lentement (environment map HDRI d'intérieur) → effet *wet paint* subtil et hypnotique.
- La souris déplace très légèrement la caméra (parallax 3D, ±2°) ; au mobile, le gyroscope fait la même chose en plus doux.
- Texte et CTA restent en HTML au-dessus du canvas (SEO + accessibilité intacts).
- **Fallback** : l'actuel poster `1.jpg` + un reveal CSS `clip-path` animé.

### 4.2 Scrollytelling « Du brut à l'œuvre » — section signature 🟠

Une section pinnée (ScrollTrigger `pin + scrub`) qui raconte le métier en 4 temps pendant que l'utilisateur scrolle :
1. **Mur brut** — béton gris, lumière crue (scène 3D fixe).
2. **L'enduit** — le mur se lisse progressivement (interpolation de displacement map).
3. **La couleur** — une vague émeraude se propage (shader de flood-fill organique), la lumière se réchauffe.
4. **La signature** — des filets d'**or liquide** coulent dans les rainures (shader métallique animé, reflets réels via envmap) et dessinent le monogramme LK.

Chaque étape affiche en HTML le texte correspondant (« Préparer · Lisser · Colorer · Signer »). C'est LA section dont les visiteurs se souviendront.

### 4.3 Portfolio — matière et profondeur 🟠

- **Cartes projets 3D-tilt** : légère rotation perspective au survol (max 6°), avec un **reflet doré directionnel** qui suit le curseur (pseudo-éclairage), ombre portée douce qui s'étire. Au tap mobile : micro-scale + reflet bref.
- **Slider avant/après réinventé** : l'actuel `BeforeAfterSlider` devient un **rideau de peinture** — la poignée est un pinceau, et la frontière entre avant/après n'est pas une ligne droite mais un **bord de peinture irrégulier avec coulures** (masque SVG turbulence). Effet mémorable, coût technique faible.
- **Transition page liste → détail** : l'image du projet cliqué **s'agrandit en continu** vers le hero de la page détail (shared element transition, `ViewTransition API` ou Framer Motion `layoutId`). Zéro coupure : sensation d'app native.
- **Galerie immersive** : en vue détail, mode « pièce » optionnel — les photos du chantier projetées sur les murs d'une pièce 3D minimaliste dans laquelle on pivote à la souris (R3F, 1 scène réutilisée). Version bonus 🟢.

### 4.4 Section Epoxy résine — démo produit en 3D réaliste 🟢

L'epoxy est LE service le plus « waouh » et le plus difficile à photographier. Une scène 3D dédiée :
- Un **sol en résine époxy** rendu physiquement réaliste : `MeshPhysicalMaterial` avec `clearcoat` élevé, reflets miroir de l'environnement, profondeur des pigments métallisés (parallax interne via normal maps superposées).
- L'utilisateur **choisit la teinte** (nuancier : émeraude, ambre, marbre blanc, noir métallisé) et voit le sol changer en temps réel — premier pas vers un **configurateur** qui alimente directement le formulaire de devis (« Je veux ce rendu » → pré-rempli).
- Une goutte de résine tombe et s'étale en boucle lente (simulation simple type metaball 2D projetée) — signature visuelle de la section.

### 4.5 Ambiance globale & micro-interactions 🟠

- **Smooth scroll Lenis** partout (sauf admin) : inertie douce, c'est le liant de tous les effets.
- **Curseur personnalisé** (desktop uniquement) : point doré qui devient un **pinceau** sur les zones interactives, avec traînée de peinture qui s'évapore (canvas 2D léger). Désactivé si `pointer: coarse`.
- **Particules d'or** : poussière dorée très discrète (30–50 particules, canvas) qui dérive dans les sections sombres et réagit à peine au scroll — profondeur sans distraction. Remplace avantageusement `PaintDrops` actuel.
- **Boutons magnétiques** : les CTA (`Demander un devis`) attirent légèrement le curseur (translation max 8px) + l'onde dorée au clic.
- **Typographie cinétique** : les grands titres serif apparaissent par **masquage ligne à ligne** (chaque ligne glisse depuis le bas derrière un masque, stagger 80 ms) — standard des sites luxe, sobre et efficace.
- **Transitions de pages** : rideau émeraude→or qui balaie l'écran entre les routes (améliorer l'actuel `PageEnterWipe` en le synchronisant avec le router pour couvrir aussi la *sortie* de page).
- **Compteurs animés** : les chiffres clés (« 120+ projets ») comptent en s'affichant, avec tick doré.
- **Skeletons → shimmer or** : remplacer les skeletons gris par un shimmer doré très léger, cohérent avec la marque.

### 4.6 UX pure (au-delà des effets) 🟠

- **Le devis est le cœur business** : ajouter une **barre de progression persistante** sur les 4 étapes, sauvegarde du brouillon en localStorage (un utilisateur interrompu ne repart pas de zéro), et une estimation de fourchette de prix en direct à l'étape 2 (à partir des prix min/max des services) — énorme levier de conversion.
- **WhatsApp flottant plus intelligent** : l'actuel bouton devient contextuel — sur une page projet, le message pré-rempli référence le projet (« Bonjour, j'ai vu le projet <Villa Saly>… »).
- **Preuve sociale au bon endroit** : témoignages affichés près des CTA de devis (pas seulement en bas de home).
- **Mode sombre/clair** : déjà présent (`useTheme`) — vérifier le contraste AA sur l'or `#c9a24a` sur fond clair (souvent insuffisant : prévoir une variante or foncé pour le light mode).
- **Accessibilité** : audit axe-core ; focus visibles sur la navigation clavier (les sites « cinématiques » l'oublient toujours) ; sous-titres/`aria-label` sur les vidéos décoratives ; taille de touche ≥ 44px sur mobile.
- **Page 404 artistique** : mur avec une éclaboussure de peinture formant « 404 » — occasion de marque à faible coût.

### 4.7 Mobile (Expo) 🟢

- Reprendre le langage visuel du web en version native : transitions partagées (`react-navigation shared element`), haptics sur les actions clés, skeletons shimmer or.
- Les effets 3D lourds ne sont **pas** portés sur mobile natif — à la place : Lottie (animations vectorielles légères exportées d'After Effects) pour le splash et les états vides.
- Notifications push réellement branchées sur les événements devis (« votre devis est prêt »).

---

## 5. Ordre de bataille recommandé

| Phase | Contenu | Effort estimé |
|---|---|---|
| **Phase 1 — Sécurité & fondations** 🔴 | Expiration tokens, headers sécurité, HTTPS forcé, ré-encodage images + EXIF, vérif. disque Render éphémère, APP_DEBUG off | 2–4 jours |
| **Phase 2 — Performance** 🔴🟠 | Compression vidéos, variantes d'images + WebP + lazy, code-splitting admin, R2/CDN | 3–5 jours |
| **Phase 3 — Expérience cinématique v1** 🟠 | Lenis + GSAP, hero WebGL « coup de pinceau », typographie cinétique, transitions de pages, tilt portfolio, slider avant/après « rideau de peinture », UX devis (progression + brouillon) | 1,5–2 semaines |
| **Phase 4 — Signature 3D** 🟢 | Scrollytelling « Du brut à l'œuvre », section epoxy 3D interactive, curseur pinceau, particules d'or | 2–3 semaines |
| **Phase 5 — Continu** 🟢 | Tests, Sentry, uptime, audit log, 2FA admin, PWA, Dependabot | en tâche de fond |

> **Règle d'or pour les phases 3–4** : chaque effet est développé derrière la détection `prefers-reduced-motion` + GPU, mesuré au Lighthouse avant merge, et fusionné seulement s'il ne coûte rien au LCP. Le cinéma est un bonus au-dessus d'un site rapide — jamais l'inverse.
