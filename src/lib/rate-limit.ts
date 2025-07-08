import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis-store";

export const listingRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "5 m"), // Example: 3 requests per minute
});
