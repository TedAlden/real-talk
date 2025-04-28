// Load balancer servers
export var servers = [];

// Health checker
export const healthCheckInterval = 5 * 1000; // 5 seconds

// Rate limiter
export const maxRequests = 100; // Max requests per time window (100 per 1 min)
export const maxRequestsTimeWindow = 60 * 1000; // 1 minute
