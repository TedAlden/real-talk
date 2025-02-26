export const userUpdateSchema = {
  "name.first": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "First name must be a string",
    },
    trim: true,
    escape: true,
  },
  "name.last": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Last name must be a string",
    },
    trim: true,
    escape: true,
  },
  "location.city": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "City must be a string",
    },
    trim: true,
    escape: true,
  },
  "location.state": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "State must be a string",
    },
    trim: true,
    escape: true,
  },
  "location.country": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Country must be a string",
    },
    trim: true,
    escape: true,
  },
  email: {
    in: ["body"],
    optional: true,
    isEmail: {
      errorMessage: "Must be a valid email address",
    },
    normalizeEmail: true,
  },
  username: {
    in: ["body"],
    optional: true,
    isAlphanumeric: {
      errorMessage: "Username must contain only letters and numbers",
    },
    trim: true,
    escape: true,
  },
  password: {
    in: ["body"],
    optional: true,
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
    optional: true,
    trim: true,
    escape: true,
  },
  birthday: {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "Birthday must be a valid ISO8601 date",
    },
    toDate: true,
  },
  phone: {
    in: ["body"],
    optional: true,
    matches: {
      options: [/^\d{3}-\d{4}-\d{3}$/],
      errorMessage: "Phone number must be in the format xxx-xxxx-xxx",
    },
    trim: true,
    escape: true,
  },
  picture: {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "Picture must be a valid URL",
    },
    trim: true,
  },
};
