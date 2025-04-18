// Simple in-memory cache for serverless environments
const cache: Record<string, { data: any; expires: number }> = {};

export function getCache<T = any>(key: string): T | null {
  const now = Date.now();
  if (cache[key] && cache[key].expires > now) {
    return cache[key].data;
  }
  return null;
}

export function setCache<T = any>(key: string, data: T, ttlSeconds: number) {
  cache[key] = { data, expires: Date.now() + ttlSeconds * 1000 };
}
