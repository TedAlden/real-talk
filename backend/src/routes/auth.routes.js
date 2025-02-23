import express from "express";

import {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
