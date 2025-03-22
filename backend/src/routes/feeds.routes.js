import express from "express";
import { getTrendingFeed } from "../controllers/feeds.js";

const feedsRouter = express.Router();

feedsRouter.get("/trending", getTrendingFeed);

export default feedsRouter;
