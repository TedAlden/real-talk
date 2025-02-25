import handlebars from "handlebars";
import fs from "fs";
import path from "path";

// Workaround with __dirname not being defined in ES6 modules.
// https://stackoverflow.com/a/64383997
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendUri = process.env.FRONTEND_URI || "http://localhost:5174";

export const templates = {
  verifyEmail: (username, email, token) => {
    const source = fs.readFileSync(
      path.join(__dirname, "templates/verify_email.hbs"),
      "utf8"
    );
    const template = handlebars.compile(source);
    return template({ username, email, token, frontendUri });
  },
  forgotPassword: (username, token) => {
    const source = fs.readFileSync(
      path.join(__dirname, "templates/forgot_password.hbs"),
      "utf8"
    );
    const template = handlebars.compile(source);
    return template({ username, token, frontendUri });
  },
};
