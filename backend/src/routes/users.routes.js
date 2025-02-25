import express from "express";

import {
  getUsersByQuery,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsersByQuery);
usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", updateUserById);
usersRouter.delete("/:id", deleteUserById);

export default usersRouter;
