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
    
    // Check if user has already posted today
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }
    
    // Check if daily post limit is reached (default to 1 per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If user has posted today, check if they've reached their limit
    if (user.usage_stats && user.usage_stats.last_post_date) {
      const lastPostDate = new Date(user.usage_stats.last_post_date);
      const lastPostDay = new Date(lastPostDate);
      lastPostDay.setHours(0, 0, 0, 0);
      
      const sameDay = today.getTime() === lastPostDay.getTime();
      if (sameDay && user.usage_stats.posts_today >= 1) {
        return res.status(429).json({ 
          error: "Daily post limit reached. You can post again tomorrow." 
        });
      }
    }

    // Insert the new post into the collection
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
    
    // Update user's post stats
    const postsToday = user.usage_stats && user.usage_stats.last_post_date 
      ? (new Date(user.usage_stats.last_post_date).toDateString() === new Date().toDateString() 
          ? user.usage_stats.posts_today + 1 
          : 1)
      : 1;
    
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          "usage_stats.posts_today": postsToday,
          "usage_stats.last_post_date": new Date()
        } 
      }
    );

    // 201 status means the post was created successfully
    res.status(201).json({ message: SuccessMsg.POST_CREATION_OK });
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

    const { userId, tag } = req.query;
    const filter = {};
    if (tag) filter.tags = { $in: [tag] };
    if (userId) filter.user_id = new ObjectId(userId);

    console.log(filter);
    const posts = await db
      .collection("posts")
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();
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
