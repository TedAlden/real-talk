import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";
import { matchedData } from "express-validator";

/**
 * POST /posts
 *
 * Creates a new post
 *
 * Request body:
 * {
 *  userId: string,
 *  content: string,
 *  media: string
 * }
 */
export const createPost = async (req, res) => {
  try {
    const { userId, content, media, tags } = req.body;
    const db = await connectDB();

    // Insert the new user into the collection
    const newPost = {
      user_id: new ObjectId(userId),
      content,
      media,
      likes: [],
      comments: [],
      tags,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.collection("posts").insertOne(newPost);

    // 201 status means the user was created successfully
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post creation error:", error);
    return res.status(500).json({ error: ErrorMsg.SERVER_ERROR });
  }
};

/**
 * GET /posts?user_id={}&tag={}
 *
 * Query posts by user id or tag.
 *
 * Query parameters:
 * {
 *  userId: string,
 *  tag: string,
 * }
 */
export const getPostsByQuery = async (req, res) => {
  try {
    const db = await connectDB();

    const { userId, tag, limit = 10, offset = 0 } = req.query;
    const filter = {};
    if (tag) filter.tags = { $in: [tag] };
    if (userId) filter.user_id = new ObjectId(userId);

    const posts = await db
      .collection("posts")
      .find(filter)
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
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
    console.error("Get posts by query error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /posts/:id
 *
 * Get a post by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_POST });
    }

    // Get the user who created the post
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(post.user_id) });

    post.poster = {
      _id: user._id,
      username: user.username,
      profile_picture: user.profile_picture,
    };

    res.status(200).json(post);
  } catch (err) {
    console.error("Get post error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /users/:id
 *
 * Update a post by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 *
 * Request body:
 * {
 *  content: string,
 *  media: string
 * }
 */
export const updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const updatedPost = {
      ...matchedData(req),
      updated_at: new Date(),
    };

    console.log(req.body);

    // Update post in database
    await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedPost });

    res.status(200).json({ message: SuccessMsg.POST_UPDATE_OK });
  } catch (err) {
    console.error("Update post error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /posts/:id
 *
 * Delete a post by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_POST });
    }

    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: SuccessMsg.POST_DELETE_OK });
  } catch (err) {
    console.error("Delete post error:", err);
    return res.status(500).json({ error: err.message });
  }
};
