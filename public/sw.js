/**
 * LabLegends service worker.
 *
 * Cache policy mirrors src/lib/pwa/cache-policy.ts. Only the app shell and
 * explicitly public learning content are cached. Student, teacher, progress,
 * results, lab and API responses are never stored in a shared cache.
 */

const SHELL_CACHE = "lablegends-shell-v1";
const CONTENT_CACHE = "lablegends-content-v1";
const PRECACHE = [
  "/",
  "/offline",
  "/login",
  "/missions",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

const PRIVATE_PREFIXES = ["/student", "/teacher", "/progress", "/results", "/lab", "/api"];
const PUBLIC_EXACT = ["/", "/login", "/missions", "/offline", "/manifest.webmanifest"];
const PUBLIC_PREFIXES = ["/missions/", "/icons/", "/_next/static/"];

function isPrivatePath(pathname) {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isCacheablePath(pathname) {
  if (isPrivatePath(pathname)) return false;
  if (PUBLIC_EXACT.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function shouldCacheResponse(response) {
  if (!response.ok) return false;
  if (response.headers.has("set-cookie")) return false;
  const cacheControl = response.headers.get("cache-control") || "";
  return !/no-store|private/i.test(cacheControl);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== CONTENT_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isPrivatePath(url.pathname)) return;

  if (request.mode === "navigate" && !isCacheablePath(url.pathname)) {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match("/offline")) || Response.error()),
    );
    return;
  }

  if (!isCacheablePath(url.pathname)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CONTENT_CACHE);
      const cached = await cache.match(request);

      const network = fetch(request)
        .then((response) => {
          if (shouldCacheResponse(response)) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);

      if (cached) return cached;
      const response = await network;
      if (response) return response;
      if (request.mode === "navigate") {
        return (await caches.match("/offline")) || Response.error();
      }
      return Response.error();
    })(),
  );
});
