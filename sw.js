/* Toy Haven - sw.js (service worker)
   A service worker is a small script the browser runs in the background.
   This one saves (caches) our files so the site can open even when offline.
   If you change your files, change the version number in CACHE_NAME. */

var CACHE_NAME = "toy-haven-v5";

var FILES_TO_CACHE = [
  "./",
  "index.html",
  "products.html",
  "wishlist.html",
  "cart.html",
  "checkout.html",
  "feedback.html",
  "style.css",
  "script.js",
  "manifest.json",
  "images/favicon.png",
  "images/hero-1.jpg",
  "images/hero-2.jpg",
  "images/hero-3.jpg",
  "images/hero-4.jpg",
  "images/icon-192.png",
  "images/icon-512.png",
  "images/dragon-knight.jpg",
  "images/space-explorer.jpg",
  "images/anime-hero.jpg",
  "images/building-blocks.jpg",
  "images/teddy-bear.jpg",
  "images/robot-toy.jpg",
  "images/chess-set.jpg",
  "images/treasure-island.jpg",
  "images/word-master.jpg",
  "images/sports-car.jpg",
  "images/classic-jeep.jpg",
  "images/police-car.jpg"
];

// 1. Install: save all the files
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 2. Activate: delete old caches from earlier versions
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.map(function (name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// 3. Fetch: use the saved file if we have it, otherwise get it from the internet
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (saved) {
      return saved || fetch(event.request);
    })
  );
});
