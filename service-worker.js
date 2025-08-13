const CACHE_NAME = 'gas-detection-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://via.placeholder.com/100'
];

self.addEventListener('install', (event) => {
  // Pre-cache all essential assets during installation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Intercept network requests and serve from cache if available
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise, fetch from the network
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});