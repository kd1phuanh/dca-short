// DCA Short Terminal - Service Worker
const CACHE_NAME = 'dca-short-v1.0.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy
// - App shell + same-origin: cache-first
// - Cross-origin (Binance, Gemini, fonts, chart.js CDN): network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET (POST to Binance/Gemini won't be cached)
  if (req.method !== 'GET') return;

  // Don't cache API endpoints (need fresh data)
  if (url.hostname.includes('binance.com') ||
      url.hostname.includes('generativelanguage.googleapis.com') ||
      url.hostname.includes('api.anthropic.com') ||
      url.hostname.includes('openrouter.ai') ||
      url.hostname.includes('googleapis.com/drive')) {
    return; // Let browser handle normally
  }

  // Same-origin or static assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Refresh in background
        fetch(req).then(res => {
          if (res.ok) {
            caches.open(CACHE_NAME).then(c => c.put(req, res));
          }
        }).catch(() => {});
        return cached;
      }
      // Not cached - fetch and cache
      return fetch(req).then((res) => {
        if (res.ok && (url.origin === self.location.origin ||
                       url.hostname.includes('fonts.googleapis.com') ||
                       url.hostname.includes('fonts.gstatic.com') ||
                       url.hostname.includes('cdn.jsdelivr.net') ||
                       url.hostname.includes('unpkg.com'))) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
