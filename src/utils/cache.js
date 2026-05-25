/**
 * In-memory Stale-While-Revalidate (SWR) Cache
 * Solves: Over-fetching from the database for read-heavy public routes.
 * Risk: Memory bloat on Edge/Client if not bounded.
 * Architecture: Map-based LRU-style tracking with TTL and deduplicated active promises.
 */

class SWRCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.activeRequests = new Map();
    this.maxSize = maxSize;
  }

  _enforceLimit() {
    if (this.cache.size > this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Fetches data with SWR strategy.
   * @param {string} key Cache key
   * @param {function} fetcher Async function returning data
   * @param {number} ttl Time to live in ms (default 5 mins)
   */
  async fetch(key, fetcher, ttl = 300000) {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Cache Hit (Fresh)
    if (cached && (now - cached.timestamp < ttl)) {
      return cached.data;
    }

    // Deduplicate concurrent requests for the exact same key
    if (this.activeRequests.has(key)) {
      return this.activeRequests.get(key);
    }

    const requestPromise = (async () => {
      try {
        const data = await fetcher();
        this.cache.set(key, { data, timestamp: now });
        this._enforceLimit();

        // Cache Hit (Stale) - Background update trigger in SWR pattern
        // The await above blocks this return, so we return the fresh data.
        // True SWR would return stale immediately and fetch in bg.
        // For simplicity, we block if it's stale, but deduplicate.

        return data;
      } finally {
        this.activeRequests.delete(key);
      }
    })();

    this.activeRequests.set(key, requestPromise);

    // If we have stale data, return it immediately while fetching fresh data in background
    if (cached) {
      // Swallows unhandled promise rejections on background updates to avoid crashing UI
      requestPromise.catch(() => {});
      return cached.data;
    }

    return requestPromise;
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const swrCache = new SWRCache();
