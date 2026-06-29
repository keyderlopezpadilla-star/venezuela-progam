/**
 * Rate limit in-memory con bucket por clave. Para producción en Vercel
 * considerar Upstash/Redis (recomendado en serverless).
 */
type Bucket = { tokens: number; lastRefill: number };

const buckets = new Map<string, Bucket>();

interface Options {
  /** Cantidad máxima de tokens. */
  capacity: number;
  /** Ventana de refill en ms. */
  refillMs: number;
}

export function createRateLimiter({ capacity, refillMs }: Options) {
  return {
    /**
     * Devuelve true si la petición debe permitirse.
     * Resta 1 token si la clave tiene cupo disponible.
     */
    take(key: string, cost = 1): boolean {
      const now = Date.now();
      const b = buckets.get(key);
      if (!b) {
        buckets.set(key, { tokens: capacity - cost, lastRefill: now });
        return true;
      }
      const elapsed = now - b.lastRefill;
      const refilled = Math.floor(elapsed / refillMs) * capacity;
      if (refilled > 0) {
        b.tokens = Math.min(capacity, b.tokens + refilled);
        b.lastRefill = now;
      }
      if (b.tokens < cost) return false;
      b.tokens -= cost;
      return true;
    },
    reset(key: string) {
      buckets.delete(key);
    },
  };
}

/** Rate limiter por defecto (más estricto para auth). */
export const authLimiter = createRateLimiter({
  capacity: 5,
  refillMs: 60_000,
});

/** Rate limiter general API. */
export const apiLimiter = createRateLimiter({
  capacity: 60,
  refillMs: 60_000,
});
