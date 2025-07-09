import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis-store";

export const listingRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "7d"), // Example: 3 requests per minute
  analytics: true,
});

export const imageUploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "7d"), // Example: 5 uploads per day per user
  analytics: true,
});

export const messageRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10s"), // 5 messages per 10 seconds
  analytics: true,
});

export const reviewRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "1m"), // 1 review per minute
  analytics: true,
});

export const reservationRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1h"),
  analytics: true,
});

export const reportRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1d"),
  analytics: true,
});

export const availabilityRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10m"),
  analytics: true,
});
export const favouriteRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "30m"),
  analytics: true,
});
