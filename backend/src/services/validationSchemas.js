export const userUpdateSchema = {
  first_name: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "First name must be a string",
    },
    trim: true,
    escape: true,
  },
  last_name: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Last name must be a string",
    },
    trim: true,
    escape: true,
  },
  "address.line_1": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Address line 1 must be a string",
    },
    trim: true,
    escape: true,
  },
  "address.line_2": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Address line 2 must be a string",
    },
    trim: true,
    escape: true,
  },
  "address.city": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "City must be a string",
    },
    trim: true,
    escape: true,
  },
  "address.state": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "State must be a string",
    },
    trim: true,
    escape: true,
  },
  "address.country": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Country must be a string",
    },
    trim: true,
    escape: true,
  },
  "address.postcode": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Postcode must be a string",
    },
    trim: true,
    escape: true,
  },
  email: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isEmail: {
      errorMessage: "Must be a valid email address",
    },
    normalizeEmail: true,
  },
  username: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isAlphanumeric: {
      errorMessage: "Username must contain only letters and numbers",
    },
    trim: true,
    escape: true,
  },
  password: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    /*     isStrongPassword: {
      options: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      errorMessage: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    }, */
    trim: true,
  },
  biography: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    trim: true,
    escape: true,
  },
  date_of_birth: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isISO8601: {
      errorMessage: "Birthday must be a valid ISO8601 date",
    },
    toDate: true,
  },
  telephone: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    trim: true,
    escape: true,
  },
  profile_picture: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    trim: true,
  },
  "mfa.secret": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    trim: true,
  },
  "mfa.enabled": {
    in: ["body"],
  },
};
