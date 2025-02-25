import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

const PORT = process.env.VITE_PORT || 5002;

//vite.dev/config
export default defineConfig({
  server: { port: PORT },
  plugins: [react()],
});
