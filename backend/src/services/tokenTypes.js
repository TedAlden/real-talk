export const TokenTypes = Object.freeze({
  /*
   * Fully authenticated token for accessing protected routes as a logged-in
   * user. A user will receive this token upon successful login, if there is no
   * MFA enabled for that account.
   */
  AUTH: "authenticated",
  /**
   * Partially authenticated token for submitting an OTP during login. A user
   * will receive this token upon successful login, if there account has MFA
   * enabled. The user must submit this token along with a correct OTP to
   * complete authentication and receive a fully authenticated token.
   */
  AWAIT_MFA: "awaiting-otp",
  /**
   * Token for verifying an account/email address. A user will receive this
   * token in an email upon successful registration. They must submit the token
   * to verify the email address it was sent to and complete the registration.
   */
  VERIFY_EMAIL: "verify-email",
  /**
   * Token for resetting a password. A user will receive this token in an email
   * upon requesting a password reset. They must submit the token along with a
   * new password to complete the password reset process.
   */
  RESET_PASSWORD: "reset-password",
});
