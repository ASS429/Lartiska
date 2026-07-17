/* eslint-env serviceworker */
/**
 * Service Worker Lartiska (PWA)
 *
 *  1. Précache de l'app shell (injecté par Workbox au build).
 *  2. Cache runtime :
 *     - photos R2 + /img : cache-first (30 j) — le portfolio se rouvre
 *       instantanément, même hors ligne ;
 *     - vidéos (R2 + /videos) : cache-first avec support des requêtes
 *       de plage (lecture/seek depuis le cache) ;
 *     - API publique (settings, catégories, services, projets,
 *       témoignages) : réseau d'abord, secours cache 4 s — le site
 *       reste consultable en zone blanche.
 *  3. Notifications push : affichage + clic → ouvre la page concernée.
 */
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { RangeRequestsPlugin } from 'workbox-range-requests';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Navigation SPA : toutes les routes servent l'app shell précaché.
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

const isR2 = (url) => url.hostname.endsWith('.r2.dev');
const isVideo = (url) => url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm') || url.pathname.endsWith('.mov');

// ── Photos (R2 + /img locaux) — cache-first 30 jours ──────────────────
registerRoute(
  ({ url, request }) => request.destination === 'image' && (isR2(url) || url.pathname.startsWith('/img/')),
  new CacheFirst({
    cacheName: 'lartiska-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 30 * 24 * 3600, purgeOnQuotaError: true }),
    ],
  }),
);

// ── Vidéos — cache-first avec requêtes de plage (seek OK) ─────────────
registerRoute(
  ({ url }) => isVideo(url) && (isR2(url) || url.pathname.startsWith('/videos/')),
  new CacheFirst({
    cacheName: 'lartiska-videos',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new RangeRequestsPlugin(),
      new ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 30 * 24 * 3600, purgeOnQuotaError: true }),
    ],
  }),
);

// ── API publique — réseau d'abord (données fraîches), cache en secours ─
registerRoute(
  ({ url, request }) => request.method === 'GET'
    && /\/api\/(settings\/public|categories|services|projects|testimonials|push\/key)/.test(url.pathname),
  new NetworkFirst({
    cacheName: 'lartiska-api',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 24 * 3600 }),
    ],
  }),
);

// ── Polices Google — stale-while-revalidate ───────────────────────────
registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com',
  new StaleWhileRevalidate({ cacheName: 'lartiska-fonts' }),
);

// ── Notifications push ────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data?.json() ?? {}; } catch { /* payload non-JSON */ }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Lartiska', {
      body: data.body || 'Du nouveau dans le portfolio.',
      icon: data.icon || '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((tabs) => {
      // Réutilise un onglet du site s'il existe, sinon en ouvre un.
      const existing = tabs.find((t) => new URL(t.url).origin === self.location.origin);
      if (existing) {
        existing.focus();
        return existing.navigate(url);
      }
      return self.clients.openWindow(url);
    }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
