import { body } from "express-validator";
import { validationResult } from "express-validator";

export const ErrorMsg = Object.freeze({
  USERNAME_TAKEN: "Username is already registered.",
  EMAIL_TAKEN: "Email is already registered.",

  NO_SUCH_USERNAME: "No registered user with that username.",
  NO_SUCH_EMAIL: "No registered user with that email.",
  UNVERIFIED_USER: "User is not verified. ",

  NEEDS_EMAIL: "A valid email is required but missing.",
  NEEDS_USERNAME: "Username is required.",
  NEEDS_PASSWORD: "Password is required.",
  NEEDS_TOKEN: "Token is required.",
  INVALID_TOKEN: "Invalid token.",
  WRONG_PASSWORD: "Incorrect password. ",
  SERVER_ERROR: "Server error.",
});

const validatorMap = {
  email: () => body("email").isEmail().withMessage(ErrorMessages.NEEDS_EMAIL),
  username: () =>
    body("username")
      .trim()
      .notEmpty()
      .withMessage(ErrorMessages.NEEDS_USERNAME),
  password: () =>
    body("password")
      .trim()
      .notEmpty()
      .withMessage(ErrorMessages.NEEDS_PASSWORD),
  token: () => body("token").notEmpty().withMessage(ErrorMessages.NEEDS_TOKEN),
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
