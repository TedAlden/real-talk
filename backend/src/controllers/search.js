import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";

export const getSearchResults = async (req, res) => {
  try {
    const db = await connectDB();
    const { query, limit = 10, offset = 0 } = req.query;

    // Validate the query parameter
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // Perform a search in the users collection
    const users = await db.collection("users").find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    // Perform a search in the posts collection
    const posts = await db.collection("posts")
      .find({ content: { $regex: query, $options: "i" } })
      .sort({ created_at: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    const userIds = posts.map((post) => post.user_id);
    const postsUsers = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();

    const postsUserMap = Object.fromEntries(
      postsUsers.map((user) => [
        user._id,
        {
          _id: user._id,
          username: user.username,
          profile_picture: user.profile_picture,
        },
      ])
    );
    posts.forEach((post) => {
      post.poster = postsUserMap[post.user_id] || null;
    });

    // Search tags
    const taggedPosts = await db.collection("posts")
      .find({ tags: { $regex: query, $options: "i" } })
      .sort({ created_at: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    const taggedUserIds = taggedPosts.map((post) => post.user_id);
    const taggedUsers = await db
      .collection("users")
      .find({ _id: { $in: taggedUserIds } })
      .toArray();

    const taggedUserMap = Object.fromEntries(
      taggedUsers.map((user) => [
        user._id,
        {
          _id: user._id,
          username: user.username,
          profile_picture: user.profile_picture,
        },
      ])
    );
    taggedPosts.forEach((post) => {
      post.poster = taggedUserMap[post.user_id] || null;
    });

    return res.status(200).json({ users, posts, taggedPosts });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
