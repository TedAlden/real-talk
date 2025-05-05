import express from "express";
import {
  getSearchResults,
} from "../controllers/search.js";

const searchRouter = express.Router();

searchRouter.get("/", getSearchResults);

export default searchRouter;
