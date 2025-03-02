export const userUpdateSchema = {
  "name.first": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "First name must be a string",
    },
    trim: true,
    escape: true,
  },
  "name.last": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Last name must be a string",
    },
    trim: true,
    escape: true,
  },
  "location.city": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "City must be a string",
    },
    trim: true,
    escape: true,
  },
  "location.state": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "State must be a string",
    },
    trim: true,
    escape: true,
  },
  "location.country": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isString: {
      errorMessage: "Country must be a string",
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
  bio: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    trim: true,
    escape: true,
  },
  birthday: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isISO8601: {
      errorMessage: "Birthday must be a valid ISO8601 date",
    },
    toDate: true,
  },
  phone: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    trim: true,
    escape: true,
  },
  picture: {
    in: ["body"],
    optional: { options: { checkFalsy: true } },

    trim: true,
  },
};
