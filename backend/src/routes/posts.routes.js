import express from "express";
import { useValidators } from "../services/validation.js";
import {
  getPostById,
  getPostsByQuery,
  updatePostById,
  deletePostById,
  createPost,
} from "../controllers/posts.js";

const postsRouter = express.Router();

postsRouter.post(
  "/",
  useValidators("user_id", "post_content", "post_media"),
  createPost
);
postsRouter.get("/", getPostsByQuery);
postsRouter.get("/:id", getPostById);
postsRouter.patch("/:id", updatePostById);
postsRouter.delete("/:id", deletePostById);

export default postsRouter;
