import express from "express";
import { getLatestFeed, getTrendingFeed } from "../controllers/feeds.js";

const feedsRouter = express.Router();

feedsRouter.get("/latest", getLatestFeed);
feedsRouter.get("/trending", getTrendingFeed);

export default feedsRouter;
