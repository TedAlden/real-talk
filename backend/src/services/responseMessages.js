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

export const SuccessMsg = Object.freeze({
  REGISTRATION_OK: "User registered successfully.",
  VERIFICATION_OK: "Email verified.",
  RESET_EMAIL_OK: "Password reset email sent.",
  PASSWORD_UPDATE_OK: "Password successfully updated.",
});
