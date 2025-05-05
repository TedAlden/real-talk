import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import followersRouter from "./routes/followers.routes.js";
import postsRouter from "./routes/posts.routes.js";
import feedsRouter from "./routes/feeds.routes.js";
import notifyRouter from "./routes/notifications.routes.js";
import adminRouter from "./routes/admin.routes.js";
import searchRouter from "./routes/search.routes.js";

// Secret key required for GitHub Actions testing workflow where a .env file
// does not exist
process.env.SECRET_KEY = process.env.SECRET_KEY
  ? process.env.SECRET_KEY
  : "secret-key";

// Create Express app
const app = express();
app.use(cors()); // Allows the frontend to communicate with the backend
app.use(express.json({ limit: "1mb" })); // Allows the backend to parse JSON objects

// Log requests
app.use((req, res, next) => {
  console.log(`Received ${req.ip} ${req.method} ${req.url}`);
  next();
});

// Add API endpoints/routes
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", followersRouter);
app.use("/api/users", notifyRouter);
app.use("/api/posts", postsRouter);
app.use("/api/feeds", feedsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/search", searchRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

export default app;
