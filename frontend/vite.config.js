import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

// eslint-disable-next-line no-undef
const PORT = process.env.VITE_PORT || 5002;

//vite.dev/config
export default defineConfig({
  server: { port: PORT, allowedHosts: true },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js"
  }
});
