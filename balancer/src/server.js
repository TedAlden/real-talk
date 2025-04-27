import express from "express";
import cors from "cors";
import commandLineArgs from "command-line-args";

import commandLineOptions from "./commandLineOptions.js";
import { healthCheckInterval, servers } from "./config.js";
import { healthCheck } from "./health.js";
import { loadBalance } from "./balancer.js";
import { rateLimit } from "./limiter.js";

const args = commandLineArgs(commandLineOptions);
const PORT = args.port || 5001;

args.servers.forEach((server) => {
  servers.push({
    address: server,
    enabled: true,
  });
});

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
app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
