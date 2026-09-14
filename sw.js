/* BahiaGo V4 Service Worker */
var CACHE = 'bahiago-v4-icons-2';
var ASSETS = ['./','./index.html','./manifest.webmanifest','./manifest.json','./favicon.ico','./apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
    return Promise.all(ASSETS.map(function(url){ return cache.add(url).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(fetch(req).then(function(res) {
    try {
      if (res && res.ok && req.url.indexOf(self.location.origin) === 0) {
        var copy = res.clone();
        caches.open(CACHE).then(function(cache){ cache.put(req, copy); });
      }
    } catch (e) {}
    return res;
  }).catch(function() {
    return caches.match(req).then(function(cached){ return cached || caches.match('./index.html'); });
  }));
});
