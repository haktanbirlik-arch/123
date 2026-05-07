const CACHE = 'fit-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './iZWyt61.png',
  './2.png',
  './icons8-fire-36.png',
  './lucid-origin_A_highly_detailed_16-bit_isometric_pixel_art_scene_depicting_a_fully-equipped_co-0.jpg',
  './SuisseIntlSAlt-Medium.woff2',
];

// Kurulum — dosyaları cache'e al
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivasyon — eski cache'leri temizle
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — önce cache'den sun, yoksa internetten al
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ── PUSH BİLDİRİMLERİ ──
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  self.registration.showNotification(data.title || '💪 Fit', {
    body: data.body || 'Antrenman zamanı!',
    icon: './2.png',
    badge: './2.png',
  });
});

// Günlük bildirim için alarm
self.addEventListener('message', e => {
  if (e.data.type === 'SCHEDULE_REMINDER') {
    const { delay, title, body } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: './2.png',
        badge: './2.png',
        vibrate: [200, 100, 200],
        tag: 'daily-reminder',
      });
      // 24 saat sonra tekrar mesaj gönder
      self.clients.matchAll().then(clients => {
        clients.forEach(c => c.postMessage({ type: 'RESCHEDULE' }));
      });
    }, delay);
  }
});