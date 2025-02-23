import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";

// Secret key required for GitHub Actions testing workflow where a .env file
// does not exist
process.env.SECRET_KEY = process.env.SECRET_KEY
  ? process.env.SECRET_KEY
  : "secret-key";

// Create Express app
const app = express();
app.use(cors()); // Allows the frontend to communicate with the backend
app.use(express.json()); // Allows the backend to parse JSON objects

// Add API endpoints/routes
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);

export default app;
