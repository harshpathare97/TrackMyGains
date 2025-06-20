// CACHE VERSIONING
const STATIC_CACHE = 'static-cache';
const DYNAMIC_CACHE = 'dynamic-cache';
const ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Utility to limit cache size
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
      }
    });
  });
};

// INSTALL EVENT — Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE EVENT — Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH EVENT — Runtime caching + offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If successful, clone and store it in cache
        if (networkResponse && networkResponse.status === 200) {
      const clonedResponse = networkResponse.clone();
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(event.request, clonedResponse);
        limitCacheSize(DYNAMIC_CACHE, 50); 
      });
    }
        return networkResponse; // Always return network response
      })
      .catch(() => {
        // If fetch fails (likely offline), return cached version
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // If it's a document (like HTML page), return offline fallback
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

let authToken = null;

// Listen for token via postMessage
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_AUTH_TOKEN') {
    authToken = event.data.token;
  }
});

// Sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-logs') {
    event.waitUntil(syncLogsToServer());
  }
});

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineDB', 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('upload')) {
        db.createObjectStore('upload', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getUploadLogs(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('upload', 'readonly');
    const store = tx.objectStore('upload');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteUploadLog(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('upload', 'readwrite');
    const store = tx.objectStore('upload');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function syncLogsToServer() {
  if (!authToken) {
    return;
  }

  try {
    const db = await openDB();
    const logs = await getUploadLogs(db);

    for (const log of logs) {
      try {
        const response = await fetch('/api/workouts/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
          body: JSON.stringify({ id: log.id, logs: log.logs }),
        });

        const res = await response.json();

        if (res.success) {
          await deleteUploadLog(db, log.id);
        }
      } catch (err) {
        console.error(`[SW] Error syncing log ${log.id}:`, err);
      }
    }
  } catch (err) {
    console.error('[SW] Failed to sync logs to server:', err);
  }
}

