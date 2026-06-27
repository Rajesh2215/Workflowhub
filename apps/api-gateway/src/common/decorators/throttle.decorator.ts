import { SetMetadata } from "@nestjs/common";

export interface ThrottleOptions {
  limit: number;
  ttl: number;
}

export const THROTTLE_KEY = 'throttle';

/**
 * Decorator to define route-specific rate limits.
 * Attaches metadata containing limit and ttl to the route handler.
 * 
 * Example usage: @Throttle(60, 60) // 60 requests max per 60 seconds
 */
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_KEY, { limit, ttl } as ThrottleOptions);