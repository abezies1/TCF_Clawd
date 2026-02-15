const CACHE_NAME = "tcf-v2";
const PRECACHE_URLS = [
  "/",
  "/cart",
  "/orders",
  "/loyalty",
  "/account",
  "/checkout",
  "/confirmation",
];

// Image cache for product photos
const IMAGE_CACHE_NAME = "tcf-images-v1";
const MAX_CACHED_IMAGES = 100;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== IMAGE_CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Image caching strategy: cache-first for Shopify CDN images
  if (
    url.hostname === "cdn.shopify.com" ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const response = await fetch(event.request);
          if (response.ok) {
            // Limit image cache size
            const keys = await cache.keys();
            if (keys.length >= MAX_CACHED_IMAGES) {
              await cache.delete(keys[0]);
            }
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          // Return a placeholder for offline images
          return new Response("", { status: 404, statusText: "Offline" });
        }
      })
    );
    return;
  }

  // API requests: network-only (don't cache API responses)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "You are offline" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // Pages & assets: network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;

          // For navigation requests, return cached home page
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }

          return new Response("Offline", { status: 503 });
        });
      })
  );
});

// Handle push notification events
self.addEventListener("push", (event) => {
  let data = { title: "Tucson Chocolate Factory", body: "You have a new notification" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.svg",
      badge: "/icons/icon-192.svg",
      vibrate: [100, 50, 100],
      data: data,
      actions: [
        { action: "view", title: "View Order" },
        { action: "dismiss", title: "Dismiss" },
      ],
    })
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(
      clients.openWindow("/orders")
    );
  } else {
    event.waitUntil(
      clients.openWindow("/")
    );
  }
});

// Background sync for offline orders
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-orders") {
    event.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders() {
  // When back online, sync any orders that were placed offline
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({ type: "SYNC_ORDERS" });
    });
  } catch {
    // Sync failed, will retry
  }
}
