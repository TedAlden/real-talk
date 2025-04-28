import express from "express";
import { useValidators } from "../services/validation.js";
import {
  getUsersByQuery,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserDailyPostCount,
  updateHealthyStreak
} from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", useValidators("search_query"), getUsersByQuery);
usersRouter.get("/:id", getUserById);
usersRouter.patch("/:id", useValidators("user_update"), updateUserById);
usersRouter.delete("/:id", deleteUserById);
usersRouter.get("/:id/daily-post-count", getUserDailyPostCount);
usersRouter.patch("/:id/update-streak", updateHealthyStreak);

export default usersRouter;
