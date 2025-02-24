import { body } from "express-validator";
import { validationResult } from "express-validator";

export const ErrorMessages = Object.freeze({
  USERNAME_ALREADY_REGISTERED: "Username is already registered.",
  EMAIL_ALREADY_REGISTERED: "Email is already registered.",

  USER_NOT_FOUND: "User doesn't exist.",
  USER_NOT_VERIFIED: "User is not verified. ",
  INCORRECT_PASSWORD: "Incorrect password. ",

  INVALID_TOKEN: "Invalid token.",
  SERVER_ERROR: "Server error.",
});

const validatorMap = {
  email: () => body("email").isEmail().withMessage("A valid email is required"),
  username: () =>
    body("username").trim().notEmpty().withMessage("Username is required"),
  password: () =>
    body("password").trim().notEmpty().withMessage("Password is required"),
  token: () => body("token").notEmpty().withMessage("Token is required"),
  // Add additional fields as needed
};

export const useValidators = (...fields) => {
  const validations = fields
    .map((field) => (validatorMap[field] ? validatorMap[field]() : null))
    .filter(Boolean);

  validations.push((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });

  return validations;
};
