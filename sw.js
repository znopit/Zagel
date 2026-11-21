// Zagel service worker: keeps the app itself offline. Your data lives in IndexedDB, not here.
const VERSION = 'zagel-v9';
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
// Network first: with a connection you always get the newest Zagel straight away;
// offline (or on a very slow connection) the saved copy opens instead.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const net = fetch(e.request, { cache: 'no-cache' });
      const res = await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej('slow'), 4000))]);
      if (res && res.ok) cache.put(e.request, res.clone());
      return res;
    } catch (err) {
      const hit = await caches.match(e.request, { ignoreSearch: true });
      if (hit) return hit;
      try { return await fetch(e.request); } catch (e2) { return caches.match('index.html'); }
    }
  })());
});
