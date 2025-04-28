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
  "anti_addiction.daily_limit_mins": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isInt: {
      options: { min: 1, max: 1440 },
      errorMessage: "Daily limit must be between 1 and 1440 minutes",
    },
    toInt: true,
  },
  "anti_addiction.grayscale_threshold": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isFloat: {
      options: { min: 0, max: 1 },
      errorMessage: "Grayscale threshold must be between 0 and 1",
    },
    toFloat: true,
  },
  "anti_addiction.grayscale_enabled": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isBoolean: {
      errorMessage: "Grayscale enabled must be a boolean",
    },
    toBoolean: true,
  },
  "anti_addiction.bedtime_grayscale.enabled": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isBoolean: {
      errorMessage: "Bedtime grayscale enabled must be a boolean",
    },
    toBoolean: true,
  },
  "anti_addiction.bedtime_grayscale.start_time": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    matches: {
      options: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: "Start time must be in format HH:MM",
    },
    trim: true,
  },
  "anti_addiction.bedtime_grayscale.end_time": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    matches: {
      options: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: "End time must be in format HH:MM",
    },
    trim: true,
  },
  "anti_addiction.show_reminders": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isBoolean: {
      errorMessage: "Show reminders must be a boolean",
    },
    toBoolean: true,
  },
  "anti_addiction.gamification_enabled": {
    in: ["body"],
    optional: { options: { checkFalsy: true } },
    isBoolean: {
      errorMessage: "Gamification enabled must be a boolean",
    },
    toBoolean: true,
  },
};

export const followIdSchema = {
  id: {
    in: ["params", "body"],
    optional: true,
    isMongoId: {
      errorMessage: "Invalid ID",
    },
  },
  followed_id: {
    in: ["params", "body"],
    optional: true,
    isMongoId: {
      errorMessage: "Invalid followed ID",
    },
  },
  follower_id: {
    in: ["params", "body"],
    optional: true,
    isMongoId: {
      errorMessage: "Invalid follower ID",
    },
  },
};
