# Guide — Nom de domaine, Google et notifications

> Checklist à dérouler dans l'ordre le jour où tu achètes le domaine.
> Écrit pour être suivi pas à pas, sans rien connaître par cœur.

---

## 0. AVANT le domaine — activer les notifications push (5 min, à faire maintenant)

Les clés VAPID (identité du serveur de notifications) doivent être générées **une seule fois** :

1. Sur ton PC : `cd backend` puis `php artisan webpush:vapid > vapid.txt`
2. Ouvre `vapid.txt` : il contient 2 lignes `VAPID_PUBLIC_KEY=...` et `VAPID_PRIVATE_KEY=...`
3. Copie-les comme **2 variables dans Railway** (service backend → Variables) — ⚠️ jamais dans le chat ni dans Git
4. Supprime `vapid.txt`
5. Après le redéploiement Railway : ouvre le site → footer → **« Être alerté des nouveautés »** → accepte. Publie/modifie un projet dans l'admin : la notification arrive. 🎉

---

## 1. Acheter le domaine

- Registrar conseillé : Namecheap / Cloudflare Registrar (.com ≈ 8-12 000 FCFA/an) ; pour un **.sn** : registre local (nic.sn ≈ 15-25 000 FCFA/an).
- Le code est **déjà prêt** pour `lartiska.com`, `lartiska.art` et `lartiska.sn` (CORS). Pour un autre nom, me prévenir (1 ligne à changer).

## 2. Brancher le domaine sur Render (frontend)

1. Render → service `lartiska-web` → **Settings → Custom Domains** → Add : `lartiska.sn` **et** `www.lartiska.sn`
2. Render affiche les enregistrements DNS à créer chez le registrar (`A` / `CNAME`) — copie-les tels quels
3. Attendre la vérification (quelques minutes → quelques heures) ; le certificat HTTPS est automatique

## 3. Mettre à jour les variables (2 endroits)

| Où | Variable | Nouvelle valeur |
|---|---|---|
| **Render** (frontend → Environment) | `VITE_SITE_URL` | `https://lartiska.sn` |
| **Railway** (backend → Variables) | `FRONTEND_URL` | `https://lartiska.sn` |

Puis redéployer les deux. Effets automatiques : URLs canoniques + Open Graph, sitemap, emails de reset, liens PDF.

## 4. Fichier à modifier (1 seul)

- `web/public/robots.txt` : remplacer `https://lartiska.onrender.com/sitemap.xml` par `https://lartiska.sn/sitemap.xml` (me le demander = 30 secondes).

## 5. Google Search Console (la « soumission à Google »)

1. [search.google.com/search-console](https://search.google.com/search-console) → **Ajouter une propriété** → type **Domaine** → `lartiska.sn`
2. Google donne un enregistrement **TXT** à créer dans le DNS du registrar → créer → **Vérifier**
3. Search Console → **Sitemaps** → soumettre : `https://lartiska.sn/sitemap.xml`
4. **Inspection d'URL** → tester la page d'accueil → **Demander une indexation** (faire pareil pour /services et /portfolio)
5. Patience : première indexation sous 2 à 14 jours. Suivre dans Search Console → Pages.

## 6. Bonus visibilité (fortement conseillé)

- **Google Business Profile** ([business.google.com](https://business.google.com)) : fiche « Lartiska » à Mbour avec photos des réalisations, lien site, numéro de Malick — c'est LE levier local n°1 au Sénégal (recherches « peintre Mbour », Maps…)
- Mettre l'URL du site dans les bios **TikTok / Instagram / Facebook / YouTube**
- Email pro (`contact@lartiska.sn`) + domaine vérifié chez **Resend** pour que les emails de devis ne partent plus de `onboarding@resend.dev`

---

## Ce qui est déjà en place (rien à faire)

✅ PWA installable (manifest + icônes + service worker)
✅ Cache hors-ligne : photos (30 j), vidéos (avec lecture depuis le cache), données publiques de l'API
✅ Notifications push à chaque publication/màj de projet (anti-spam : 1 notif max/6 h par projet)
✅ Sitemap dynamique (`/sitemap.xml`) régénéré toutes les 30 min, proxifié sur le domaine du site
✅ robots.txt, balises SEO, données structurées LocalBusiness/FAQ, canoniques pilotées par variable
