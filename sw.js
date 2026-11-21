// Zagel service worker: keeps the app itself offline. Your data lives in IndexedDB, not here.
const VERSION = 'zagel-v3';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'js/app.js', 'js/db.js', 'js/art.js', 'js/ui.js', 'js/home.js',
  'js/views/days.js', 'js/views/hat.js', 'js/views/wishes.js', 'js/views/looks.js',
  'js/views/cauldron.js', 'js/views/shelf.js', 'js/views/grimoire.js', 'js/views/settings.js',
  'fonts/display-600.woff', 'fonts/display-500.woff', 'fonts/text-400.woff', 'fonts/text-400i.woff', 'fonts/text-500.woff',
  'img/zoi.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
