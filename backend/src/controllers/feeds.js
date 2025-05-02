import { connectDB } from "../database/connection.js";

export const getSuggestedFeed = async (req, res) => {
  throw new Error("Not implemented");
};

export const getFollowingFeed = async (req, res) => {
  throw new Error("Not implemented");
};

export const getLatestFeed = async (req, res) => {
  try {
    const db = await connectDB();
    const posts = await db
      .collection("posts")
      .find()
      .sort({ created_at: -1 })
      .toArray();

    const userIds = posts.map((post) => post.user_id);
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();

    const userMap = Object.fromEntries(users.map((user) => [user._id, {
      _id: user._id,
      username: user.username,
      profile_picture: user.profile_picture,
    }]));

    posts.forEach((post) => {
      post.poster = userMap[post.user_id] || null;
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Get latest feed error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getTrendingFeed = async (req, res) => {
  // try {
  //   const db = await connectDB();
  //   const posts = await db.collection("posts").find().toArray();

  //   const userIds = posts.map((post) => post.user_id);
  //   const users = await db
  //     .collection("users")
  //     .find({ _id: { $in: userIds } })
  //     .toArray();

  //   const userMap = Object.fromEntries(users.map((user) => [user._id, {
  //     _id: user._id,
  //     username: user.username,
  //     profile_picture: user.profile_picture,
  //   }]));

  //   posts.forEach((post) => {
  //     post.poster = userMap[post.user_id] || null;
  //   });

  //   // Sort posts by number of likes
  //   const sortedPosts = posts.sort((a, b) => b.likes.length - a.likes.length);

  //   return res.status(200).json(sortedPosts);
  // } catch (err) {
  //   console.error("Get trending feed error:", err);
  //   return res.status(500).json({ error: err.message });
  // }

  throw new Error("Not implemented");
};
