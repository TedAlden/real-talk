import express from "express";
import { useValidators } from "../services/validation.js";
import {
  getFollowersById,
  getFollowedUsersById,
  isUserFollowing,
  unfollowUser,
  createFollow,
  getUserFollowStats,
  getSuggestedFollows,
} from "../controllers/followers.js";

const followersRouter = express.Router();

followersRouter.get(
  "/:id/followers",
  useValidators("follows"),
  getFollowersById
);
followersRouter.get(
  "/:id/followed",
  useValidators("follows"),
  getFollowedUsersById
);
followersRouter.get(
  "/:id/follow_stats",
  useValidators("follows"),
  getUserFollowStats
);
followersRouter.get(
  "/:follower_id/is_following/:followed_id",
  useValidators("follows"),
  isUserFollowing
);
followersRouter.get(
  "/:id/suggested_follows",
  useValidators("follows"),
  getSuggestedFollows
);
followersRouter.post("/follows", useValidators("follows"), createFollow);
followersRouter.delete(
  "/:follower_id/unfollow/:followed_id",
  useValidators("follows"),
  unfollowUser
);

export default followersRouter;
