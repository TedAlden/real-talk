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
  EMPTY_POST: "Post content is empty.",
  NEEDS_USER_ID: "User ID is required.",
  NEEDS_TOKEN: "Token is required.",
  INVALID_TOKEN: "Invalid token.",
  INVALID_ID: "Invalid user ID.",
  INVALID_FOLLOWER: "Invalid follower ID.",
  INVALID_FOLLOWED: "Invalid followed ID.",
  WRONG_PASSWORD: "Incorrect password.",
  SERVER_ERROR: "Server error.",
  NO_SUCH_POST: "No post with that ID.",
  NO_SUCH_COMMENT: "No comment with that ID.",

  INVALID_LIKE_VALUE: "Invalid like value.",
  INCORRECT_OTP: "Incorrect OTP.",
  OTP_EXPIRED: "OTP has expired.",
  MFA_NOT_ENABLED: "MFA is not enabled for this user.",
});

export const SuccessMsg = Object.freeze({
  REGISTRATION_OK: "User registered successfully.",
  VERIFICATION_OK: "Email verified.",
  RESET_EMAIL_OK: "Password reset email sent.",
  RESET_PASSWORD_OK: "Password reset successful.",
  POST_UPDATE_OK: "Post updated successfully.",
  POST_CREATION_OK: "Post created successfully.",
  PASSWORD_UPDATE_OK: "Password successfully updated.",
  USER_DELETE_OK: "User deleted successfully.",
  USER_UPDATE_OK: "User updated successfully.",
  LIKE_UPDATE_OK: "Like updated successfully.",
  COMMENT_UPDATE_OK: "Comment updated successfully.",
  COMMENT_CREATE_OK: "Comment created successfully.",
  COMMENT_DELETE_OK: "Comment deleted successfully.",
});
