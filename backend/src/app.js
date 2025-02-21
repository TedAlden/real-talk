import "dotenv/config.js";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";

// Create Express app
const app = express();
app.use(cors()); // Allows the frontend to communicate with the backend
app.use(express.json()); // Allows the backend to parse JSON objects

// Add API endpoints/routes
app.use("/auth", authRouter);

export default app;
