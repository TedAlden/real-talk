import axios from "axios";

import { servers } from "./config.js";
import { getTimestamp } from "./utils.js";

/**
 * Check if the server is healthy by sending a GET request to its /health
 * endpoint.
 */
async function isServerHealthy(serverAddress) {
  try {
    const result = await axios.get(serverAddress + "/health");
    return result.status === 200;
  } catch (err) {
    return false;
  }
}

/**
 * Check the health of each server in the pool and update their status.
 */
export async function healthCheck() {
  servers.forEach(async (server, index) => {
    if (server.address === undefined) {
      throw new Error(`Server address is undefined at index ${index}`);
    }
    const isHealthy = await isServerHealthy(server.address);
    const time = getTimestamp();
    if (server.enabled) {
      if (isHealthy) {
        console.log(`[${time}] [CHK] ${server.address} is still healthy.`);
      }
      else {
        console.log(`[${time}] [CHK] ${server.address} is now unhealthy. Removing from pool.`);
        server.enabled = false;
      }
    }
    else if (!server.enabled) {
      if (isHealthy) {
        console.log(`[${time}] [CHK] ${server.address} is now healthy. Adding back to pool.`);
        server.enabled = true;
      }
      else {
        console.log(`[${time}] [CHK] ${server.address} is still unhealthy.`);
      }
    }
  });
}
