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
