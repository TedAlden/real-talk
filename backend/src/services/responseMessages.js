export const ErrorMsg = Object.freeze({
  USERNAME_TAKEN: "Username is already registered.",
  EMAIL_TAKEN: "Email is already registered.",

  NO_SUCH_USERNAME: "No registered user with that username.",
  NO_SUCH_EMAIL: "No registered user with that email.",
  NO_SUCH_ID: "No registered user with that id.",

  UNVERIFIED_USER: "User is not verified. ",
  INVALID_ID: "User ID is invalid.",

  NEEDS_EMAIL: "A valid email is required but missing.",
  NEEDS_USERNAME: "Username is required.",
  NEEDS_PASSWORD: "Password is required.",
  NEEDS_TOKEN: "Token is required.",
  INVALID_TOKEN: "Invalid token.",
  INVALID_ID: "Invalid user ID.",
  INVALID_FOLLOWER: "Invalid follower ID.",
  INVALID_FOLLOWED: "Invalid followed ID.",
  WRONG_PASSWORD: "Incorrect password.",
  SERVER_ERROR: "Server error.",

  INCORRECT_OTP: "Incorrect OTP.",
  OTP_EXPIRED: "OTP has expired.",
  MFA_NOT_ENABLED: "MFA is not enabled for this user.",
});

export const SuccessMsg = Object.freeze({
  REGISTRATION_OK: "User registered successfully.",
  VERIFICATION_OK: "Email verified.",
  RESET_EMAIL_OK: "Password reset email sent.",
  PASSWORD_UPDATE_OK: "Password successfully updated.",
  USER_DELETE_OK: "User deleted successfully.",
  USER_UPDATE_OK: "User updated successfully.",
});
