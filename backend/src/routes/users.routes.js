import express from "express";

import { getUsers } from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

export default usersRouter;
