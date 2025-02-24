import { body } from "express-validator";
import { validationResult } from "express-validator";

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
