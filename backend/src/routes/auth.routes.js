import express from "express";
import { useValidators } from "../services/validation.js";
import {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", useValidators("register"), register);
authRouter.post("/login", useValidators("username", "password"), login);
authRouter.post("/verify-email", useValidators("email", "token"), verifyEmail);
authRouter.post("/forgot-password", useValidators("email"), forgotPassword);
authRouter.post(
  "/reset-password",
  useValidators("token", "password"),
  resetPassword
);
authRouter.post("/verify-otp", verifyOtp);

export default authRouter;
