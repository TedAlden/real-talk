import "dotenv/config";

// Load balancer server
export const port = process.env.PORT || 5001;
export const servers = [
  {
    address: "http://localhost:5101",
    enabled: true
  },
  {
    address: "http://localhost:5102",
    enabled: true
  },
  {
    address: "http://localhost:5103",
    enabled: true
  },
  {
    address: "http://localhost:5104",
    enabled: true
  },
];

// Health checker
export const healthCheckInterval = 5 * 1000; // 5 seconds

// Rate limiter
export const maxRequests = 100; // Max requests per time window (100 per 1 min)
export const maxRequestsTimeWindow = 60 * 1000; // 1 minute
