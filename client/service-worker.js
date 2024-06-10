const CACHE_NAME = 'festivate-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.json',
  '/src/main.jsx',
  '/icons/Festivate500.png',
  '/icons/Festlogo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return the cached response if found, otherwise fetch from the network
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error('Fetch failed; returning offline page instead.', error);
        return caches.match('/offline.html'); // Make sure to cache an offline.html page
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
