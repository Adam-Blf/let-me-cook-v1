// Service Worker · cache-first pour le shell + network-first pour les recettes
const CACHE_NAME = 'let-me-cook-v1';
const SHELL = ['/', '/app', '/paywall', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // ne cache pas les API, l'auth, ni les routes dynamiques
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  e.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        // stale-while-revalidate · met à jour en arrière-plan
        fetch(request).then((r) => {
          if (r.ok) caches.open(CACHE_NAME).then((c) => c.put(request, r.clone()));
        }).catch(() => {});
        return cached;
      }
      try {
        const fresh = await fetch(request);
        if (fresh.ok && url.origin === self.location.origin) {
          caches.open(CACHE_NAME).then((c) => c.put(request, fresh.clone()));
        }
        return fresh;
      } catch {
        return caches.match('/');
      }
    })()
  );
});
