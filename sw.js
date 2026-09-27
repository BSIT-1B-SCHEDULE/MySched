const CACHE_NAME = "mysched-v10";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./LOGO.png",
  "./manifest.json"
];

// Install: cache all files
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, cache fallback (so updates arrive)
self.addEventListener("fetch", function (event) {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip Firebase and external requests (don't cache them)
  const url = event.request.url;
  if (!url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Save fresh copy to cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(function () {
        // Offline → serve from cache
        return caches.match(event.request);
      })
  );
});