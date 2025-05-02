import express from "express";
import {
  getFollowingFeed,
  getLatestFeed,
  getTrendingFeed,
} from "../controllers/feeds.js";

const feedsRouter = express.Router();

feedsRouter.get("/following/:userId", getFollowingFeed);
feedsRouter.get("/latest", getLatestFeed);
feedsRouter.get("/trending", getTrendingFeed);

export default feedsRouter;
