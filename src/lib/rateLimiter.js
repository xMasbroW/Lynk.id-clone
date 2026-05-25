/**
 * Redis-backed Distributed Rate Limiter
 * For edge/server-side operations to prevent abuse and brute forcing.
 * NOTE: This is designed for server-side usage (e.g. Edge Functions) since
 * exposing Redis tokens to the client is unsafe. However, the abstraction
 * is placed here to be shared across Deno Edge Functions and future Node APIs.
 */

import { Redis } from '@upstash/redis'

export const createRateLimiter = (redisUrl, redisToken) => {
  if (!redisUrl || !redisToken) {
    return {
      check: async () => ({ allowed: true, remaining: 1, reset: Date.now() })
    }
  }

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })

  /**
   * Fixed window rate limiter
   * @param {string} identifier IP address or user ID
   * @param {number} limit Max requests per window
   * @param {number} windowSeconds Duration of the window in seconds
   */
  const check = async (identifier, limit = 10, windowSeconds = 60) => {
    const key = `ratelimit:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`

    // Increment atomically
    const requests = await redis.incr(key)

    if (requests === 1) {
      await redis.expire(key, windowSeconds)
    }

    return {
      allowed: requests <= limit,
      remaining: Math.max(0, limit - requests),
      reset: Date.now() + (windowSeconds * 1000)
    }
  }

  return { check }
}
