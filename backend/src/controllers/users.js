import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";
import { matchedData } from "express-validator";
import bcrypt from "bcrypt";

/**
 * GET /users?id={}&username={}&email={}
 *
 * Query users by username, email, and/or ID.
 *
 * Query parameters:
 * {
 *  id: string
 *  username: string,
 *  email: string,
 * }
 */
export const getUsersByQuery = async (req, res) => {
  try {
    const db = await connectDB();

    const { username, email, id } = req.query;
    const filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;
    if (id) {
      const ids = id.split(",").filter(Boolean);
      if (ids.length === 0) {
        return res.status(400).json({ error: ErrorMsg.INVALID_ID });
      }

      try {
        filter._id = { $in: ids.map((userId) => new ObjectId(userId)) };
      } catch (err) {
        return res.status(400).json({ error: ErrorMsg.INVALID_ID });
      }
    }

    const users = await db
      .collection("users")
      .find(filter, { projection: { password: false } }) // Exclude password
      .toArray();
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get users by query error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /users/:id
 *
 * Get a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: false } }
    );

    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /users/:id
 *
 * Update a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 *
 * Request body:
 * {
 *  username: string,
 *  email: string,
 *  password: string,
 *  ...
 * }
 */
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    // Check user exists
    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    // Check email is not taken
    const emailExists = await userCollection.findOne({ email: req.body.email });
    if (emailExists && emailExists._id.toString() !== id) {
      return res.status(400).json({ error: ErrorMsg.EMAIL_TAKEN });
    }

    // Check username is not taken
    const usernameExists = await userCollection.findOne({
      username: req.body.username,
    });
    if (usernameExists && usernameExists._id.toString() !== id) {
      return res.status(400).json({ error: ErrorMsg.USERNAME_TAKEN });
    }

    // Update the new user object with the validated fields
    const updatedUser = {
      ...matchedData(req),
    };

    console.log(req.body);

    // Hash password
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    // Update user in database
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    res.status(200).json({ message: SuccessMsg.USER_UPDATE_OK });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /users/:id
 *
 * Delete a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    await userCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: SuccessMsg.USER_DELETE_OK });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /users/:id/daily-post-count
 *
 * Get the user's daily post count and limit
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getUserDailyPostCount = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { "usage_stats": 1 } }
    );

    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    // Check if last post was today
    let postCount = 0;
    if (user.usage_stats?.last_post_date) {
      const lastPostDate = new Date(user.usage_stats.last_post_date);
      const today = new Date();
      
      if (
        lastPostDate.getDate() === today.getDate() &&
        lastPostDate.getMonth() === today.getMonth() &&
        lastPostDate.getFullYear() === today.getFullYear()
      ) {
        postCount = user.usage_stats.posts_today || 0;
      }
    }

    // Default limit is 1 post per day
    const limit = 1;
    const hasReachedLimit = postCount >= limit;

    res.status(200).json({
      data: {
        count: postCount,
        limit: limit,
        has_reached_limit: hasReachedLimit
      }
    });
  } catch (err) {
    console.error("Get user daily post count error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /users/:id/update-streak
 *
 * Update the user's healthy days streak.
 * Called when the user stays under their daily usage limit.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 * 
 * Request body:
 * {
 *  maintained_limit: boolean - Whether the user stayed under their limit
 * }
 */
export const updateHealthyStreak = async (req, res) => {
  try {
    const { id } = req.params;
    const { maintained_limit } = req.body;
    
    const db = await connectDB();
    const userCollection = db.collection("users");
    
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }
    
    // Get current streak
    let currentStreak = user.usage_stats?.healthy_days_streak || 0;
    
    // Check if the last activity was yesterday
    let shouldIncrementStreak = false;
    if (user.usage_stats?.last_activity) {
      const lastActivity = new Date(user.usage_stats.last_activity);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if last activity was yesterday (same day as yesterday)
      const lastActivityDay = new Date(lastActivity);
      lastActivityDay.setHours(0, 0, 0, 0);
      
      const yesterdayDay = new Date(yesterday);
      yesterdayDay.setHours(0, 0, 0, 0);
      
      shouldIncrementStreak = lastActivityDay.getTime() === yesterdayDay.getTime();
    }
    
    // Update streak
    let newStreak = currentStreak;
    if (maintained_limit) {
      // If the user stayed under their limit, increment their streak
      // but only if they logged in yesterday or the streak is 0
      if (shouldIncrementStreak || currentStreak === 0) {
        newStreak = currentStreak + 1;
      }
    } else {
      // Reset streak if they exceeded their limit
      newStreak = 0;
    }
    
    // Update user in database
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "usage_stats.healthy_days_streak": newStreak } }
    );
    
    res.status(200).json({ 
      message: SuccessMsg.USER_UPDATE_OK,
      data: {
        healthy_days_streak: newStreak
      }
    });
  } catch (err) {
    console.error("Update healthy streak error:", err);
    return res.status(500).json({ error: err.message });
  }
};
