import axios from "axios";

import { servers } from "./config.js";
import { getTimestamp } from "./utils.js";

let currentIndex = 0;

/**
 * Get the address of the next available server in the pool, using a round-robin
 * approach.
 */
function getNextServer() {
  let serverFound = false;
  currentIndex = (currentIndex + 1) % servers.length;
  while (!serverFound) {
    if (servers[currentIndex].enabled) {
      serverFound = true;
    } else {
      currentIndex = (currentIndex + 1) % servers.length;
    }
  }
  if (serverFound) {
    return servers[currentIndex].address;
  }
  return null;
}

/**
 * Forward the request to the selected backend server and return the response in
 * the response status.
 */
function forwardRequest(req, res, server) {
  return new Promise((resolve, reject) => {
    const options = {
      method: req.method,
      url: new URL(req.url, server).href,
      headers: req.headers,
      data: req.body,
      validateStatus: function (status) {
        return status < 400;
      },
    };
    axios(options)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Load balance the request to the next available backend server.
 */
export async function loadBalance(req, res) {
  // Get next backend server
  const server = getNextServer();
  const time = getTimestamp();
  if (!server) {
    console.log(`[${time}] [ERR] No available servers to receive request.`);
    res.status(503).send("No available backend servers");
    return;
  }
  // Forward request
  await forwardRequest(req, res, server)
    .then((response) => {
      console.log(
        `[${time}] [FWD] Forwarded ${req.ip} ${req.method} ${req.url} to ${server}`
      );
      res.status(response.status).send(response.data);
    })
    .catch((err) => {
      console.log(
        `[${time}] [ERR] Failed to forward ${req.method} ${req.url} to ${server}: ${err.message}`
      );
      res.status(500).send("Failed to connect to backend");
    });
}
