/**
 * Rate limiter simple en mémoire (par IP).
 * En production avec plusieurs instances, préférer Redis (ex: @upstash/ratelimit).
 * Utilisé pour éviter les abus et la surcharge CPU/mémoire.
 */
import type { NextRequest } from "next/server";

const windowMs = 60 * 1000; // 1 minute
const store = new Map<
  string,
  { count: number; resetAt: number }
>();

function cleanup() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) store.delete(key);
  }
}
// Nettoyage toutes les 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanup, 2 * 60 * 1000);
}

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp.trim();
  return "unknown";
}

export type RateLimitOptions = {
  limit: number;
  windowMs?: number;
};

/**
 * Vérifie si la requête est dans la limite. Retourne true si autorisée, false si limit dépassée.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetIn: number } {
  const { limit, windowMs: w = windowMs } = options;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + w });
    return { allowed: true, remaining: limit - 1, resetIn: w };
  }

  if (entry.resetAt < now) {
    entry.count = 1;
    entry.resetAt = now + w;
    return { allowed: true, remaining: limit - 1, resetIn: w };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  const allowed = entry.count <= limit;
  return {
    allowed,
    remaining,
    resetIn: Math.max(0, entry.resetAt - now),
  };
}

/**
 * Helper pour les API routes : si dépassement, retourne une Response 429 à envoyer, sinon null.
 */
export function rateLimitResponse(
  request: NextRequest,
  options: RateLimitOptions
): Response | null {
  const id = getClientIdentifier(request);
  const { allowed, remaining, resetIn } = checkRateLimit(id, options);
  if (allowed) return null;
  return new Response(
    JSON.stringify({
      error: "Trop de requêtes. Réessayez plus tard.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil(resetIn / 1000)),
        "X-RateLimit-Remaining": String(remaining),
      },
    }
  );
}
