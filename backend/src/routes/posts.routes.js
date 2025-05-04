import express from "express";
import { useValidators } from "../services/validation.js";
import {
  getPostById,
  getPostsByQuery,
  updatePostById,
  deletePostById,
  createPost,
  getTrendingTags,
} from "../controllers/posts.js";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comments.js";
import { setLike } from "../controllers/likes.js";

const postsRouter = express.Router();

// Posts
postsRouter.post(
  "/",
  useValidators("user_id", "post_content", "post_media"),
  createPost
);
postsRouter.get("/", getPostsByQuery);
postsRouter.get("/:id", getPostById);
postsRouter.patch("/:id", useValidators("post_content"), updatePostById);
postsRouter.delete("/:id", deletePostById);

// Posts :: likes
postsRouter.post("/:id/likes", setLike);

// Posts :: comments
postsRouter.post("/:id/comments", createComment);
postsRouter.get("/:id/comments", getComments);
postsRouter.get("/:id/comments/:commentId", getCommentById);
postsRouter.put("/:id/comments/:commentId", updateComment);
postsRouter.delete("/:id/comments/:commentId", deleteComment);

// Posts :: tags
postsRouter.get("/tags/trending", getTrendingTags);

export default postsRouter;
