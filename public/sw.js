// Service Worker · cache shell + stale-while-revalidate + offline fallback
const CACHE = 'let-me-cook-v2';
const SHELL = [
  '/',
  '/library',
  '/paywall',
  '/offline',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  e.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        fetch(request).then((r) => {
          if (r.ok) caches.open(CACHE).then((c) => c.put(request, r.clone()));
        }).catch(() => {});
        return cached;
      }
      try {
        const fresh = await fetch(request);
        if (fresh.ok) caches.open(CACHE).then((c) => c.put(request, fresh.clone()));
        return fresh;
      } catch {
        // fallback offline
        const offline = await caches.match('/offline');
        return offline ?? new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })()
  );
});
