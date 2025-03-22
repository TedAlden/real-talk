import { connectDB } from "../database/connection.js";

export const getSuggestedFeed = async (req, res) => {
  throw new Error("Not implemented");
};

export const getFollowingFeed = async (req, res) => {
  throw new Error("Not implemented");
};

export const getTrendingFeed = async (req, res) => {
  try {
    const db = await connectDB();
    const posts = await db.collection("posts").find().toArray();

    // Sort posts by number of likes
    const sortedPosts = posts.sort((a, b) => b.likes.length - a.likes.length);

    return res.status(200).json(sortedPosts);
  } catch (err) {
    console.error("Get trending feed error:", err);
    return res.status(500).json({ error: err.message });
  }
};
