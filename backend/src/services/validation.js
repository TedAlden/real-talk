import { body } from "express-validator";
import { validationResult } from "express-validator";
import { ErrorMsg } from "./responseMessages";

const validatorMap = {
  email: () => body("email").isEmail().withMessage(ErrorMsg.NEEDS_EMAIL),
  username: () =>
    body("username").trim().notEmpty().withMessage(ErrorMsg.NEEDS_USERNAME),
  password: () =>
    body("password").trim().notEmpty().withMessage(ErrorMsg.NEEDS_PASSWORD),
  token: () => body("token").notEmpty().withMessage(ErrorMsg.NEEDS_TOKEN),
  // Add additional fields as needed
};

export const useValidators = (...fields) => {
  const validations = fields
    .map((field) => (validatorMap[field] ? validatorMap[field]() : null))
    .filter(Boolean);

  validations.push((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  });

  return validations;
};
