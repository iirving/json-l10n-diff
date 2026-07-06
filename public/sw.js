const swUrl = new URL(self.location.href);
const appVersion = swUrl.searchParams.get('appVersion') || 'dev';
const CACHE_NAME = `json-l10n-diff-${appVersion}`;
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith('json-l10n-diff-') && key !== CACHE_NAME
            )
            .map((key) => caches.delete(key))
        );
      }),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || !response.ok) {
            return response;
          }

          const responseClone = response.clone();
          return caches
            .open(CACHE_NAME)
            .then((cache) => cache.put('/index.html', responseClone))
            .catch(() => undefined)
            .then(() => response);
        })
        .catch(() => caches.match('/index.html'))
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || !response.ok) {
          return response;
        }

        const responseClone = response.clone();
        return caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, responseClone))
          .catch(() => undefined)
          .then(() => response);
      });
    })
  );
});
