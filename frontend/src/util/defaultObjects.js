export const getSafeObject = (data, type) => {
  let defaults;
  switch (type) {
    case "user":
      defaults = defaultUser;
      break;
    case "post":
      defaults = defaultPost;
      break;
    case "comment":
      defaults = defaultComment;
      break;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
  if (!data) return defaults;
  const result = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  });

  return result;
};

export const defaultUser = {
  _id: "",
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  telephone: "",
  biography: "",
  profile_picture: "",
  address: {
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    country: "",
    postcode: {
      $numberInt: "",
    },
  },
  mfa: {
    enabled: false,
    secret: "",
  },
  anti_addiction: {
    daily_limit_mins: 60, // Default 1 hour limit
    grayscale_threshold: 0.8, // At 80% of daily limit
    grayscale_enabled: true,
    bedtime_grayscale: {
      enabled: false,
      start_time: "22:00", // 10 PM
      end_time: "06:00", // 6 AM
    },
    show_reminders: true,
    gamification_enabled: true
  },
  usage_stats: {
    daily_usage: 0, // In seconds
    last_activity: null,
    posts_today: 0,
    last_post_date: null,
    healthy_days_streak: 0
  },
  is_verified: false,
  is_admin: false,
  notifications: [],
};

export const defaultPost = {
  _id: "",
  user_id: "",
  content: "",
  media: [],
  created_at: "",
  updated_at: "",
  likes: [],
  comments: [],
};
export const defaultComment = {
  _id: "",
  user_id: "",
  content: "",
  created_at: "",
  updated_at: "",
};
