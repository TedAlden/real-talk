import express from "express";
import cors from "cors";

import { port, healthCheckInterval } from "./config.js";
import { healthCheck } from "./health.js";
import { loadBalance } from "./balancer.js";
import { rateLimit } from "./limiter.js";

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
app.use(rateLimit);

// Load balancer
app.all("*", loadBalance);

// Health checker
setInterval(() => {
  healthCheck();
}, healthCheckInterval);

// Start the server
app.listen(port, () => {
  console.log(`Load balancer running on port ${port}`);
});
