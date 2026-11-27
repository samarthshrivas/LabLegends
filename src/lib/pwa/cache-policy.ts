/**
 * Shared rules for what the service worker may cache.
 *
 * Private account and attempt data must never enter a shared browser cache.
 * Only the app shell and explicitly public learning content are cacheable.
 */

const PUBLIC_EXACT = ["/", "/login", "/missions", "/offline", "/manifest.webmanifest"] as const;
const PUBLIC_PREFIXES = ["/missions/", "/icons/", "/_next/static/"] as const;
const PRIVATE_PREFIXES = ["/student", "/teacher", "/progress", "/results", "/lab", "/api"] as const;

export function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isCacheablePath(pathname: string): boolean {
  if (isPrivatePath(pathname)) return false;
  if (PUBLIC_EXACT.includes(pathname as (typeof PUBLIC_EXACT)[number])) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return false;
}

export function shouldCacheResponse(response: Response): boolean {
  if (!response.ok) return false;
  if (response.headers.has("set-cookie")) return false;
  const cacheControl = response.headers.get("cache-control") ?? "";
  if (/no-store|private/i.test(cacheControl)) return false;
  return true;
}
