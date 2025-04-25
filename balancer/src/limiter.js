import { maxRequests, maxRequestsTimeWindow } from "./config.js";
import { getTimestamp } from "./utils.js";

const requestCounts = {};

/**
 * Rate limit middleware to limit the number of requests from a single IP, to a
 * maximum of `maxRequests` requests in a time window of `maxRequestsTimeWindow`
 * milliseconds.
 */
export async function rateLimit(req, res, next) {
  const clientIp = req.ip;
  const currentTime = Date.now();

  // Initialize the request count for the request sender if it doesn't exist
  if (!requestCounts[clientIp]) {
    requestCounts[clientIp] = {
      count: 0,
      firstRequestTime: currentTime
    };
  }

  // If the time window has passed, reset the counter and first request time
  if (currentTime - requestCounts[clientIp].firstRequestTime > maxRequestsTimeWindow) {
    requestCounts[clientIp].count = 1;
    requestCounts[clientIp].firstRequestTime = currentTime;
  } else {
    requestCounts[clientIp].count += 1;
  }

  // Check if the limit has been exceeded
  if (requestCounts[clientIp].count > maxRequests) {
    let time = getTimestamp();
    console.log(`[${time}] [LMT] Rate limit exceeded for ${clientIp}.`);
    res.status(429).send("Too many requests. Please try again later.");
  } else {
    // Otherwise, allow the request to proceed
    next();
  }
}
