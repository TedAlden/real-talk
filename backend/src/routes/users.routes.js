import express from "express";
import { useValidators } from "../services/validation.js";
import {
  getUsersByQuery,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", useValidators("search_query"), getUsersByQuery);
usersRouter.get("/:id", useValidators("id"), getUserById);
usersRouter.put("/:id", useValidators("id"), updateUserById);
usersRouter.delete("/:id", useValidators("id"), deleteUserById);

export default usersRouter;
