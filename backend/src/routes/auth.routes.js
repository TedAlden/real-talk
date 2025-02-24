import express from "express";
import { body } from "express-validator";
import {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  register
);
authRouter.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  login
);
authRouter.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("token").notEmpty().withMessage("Token is required"),
  ],
  verifyEmail
);
authRouter.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("A valid email is required")],
  forgotPassword
);
authRouter.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  resetPassword
);

export default authRouter;
