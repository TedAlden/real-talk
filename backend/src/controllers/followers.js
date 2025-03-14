import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
/**
 * GET /users/:id/followers
 *
 * Get followers of a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getFollowersById = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { viewer_id } = req.query;
    const followers = await db
      .collection("followers")
      .find({ followed_id: new ObjectId(id) })
      .toArray();
    const follower_ids = followers.map((f) => f.follower_id);

    const users = await db
      .collection("users")
      .find({ _id: { $in: follower_ids } })
      .toArray();

    const followed_by_viewer = await db
      .collection("followers")
      .find({ follower_id: new ObjectId(viewer_id) })
      .toArray();
    const followed_by_viewer_ids = followed_by_viewer.map((f) => f.followed_id);

    users.forEach((user) => {
      user.isFollowing = followed_by_viewer_ids.some((id) =>
        id.equals(user._id)
      );
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Get followers by user error:", err);
    return res.status(500).json({ error: err.message });
  }
};
/**
 * GET /users/:id/followed
 *
 * Get users followed by the user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getFollowedUsersById = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { viewer_id } = req.query;

    const followed = await db
      .collection("followers")
      .find({ follower_id: new ObjectId(id) })
      .toArray();
    const followed_ids = followed.map((f) => f.followed_id);

    const users = await db
      .collection("users")
      .find({ _id: { $in: followed_ids } })
      .toArray();

    const followed_by_viewer = await db
      .collection("followers")
      .find({ follower_id: new ObjectId(viewer_id) })
      .toArray();
    const followed_by_viewer_ids = followed_by_viewer.map((f) => f.followed_id);

    users.forEach((user) => {
      user.isFollowing = followed_by_viewer_ids.some((id) =>
        id.equals(user._id)
      );
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Get followers by user error:", err);
    return res.status(500).json({ error: err.message });
  }
};
/**
 * GET /users/:id/follow_stats
 *
 * Get count of followers of a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getUserFollowStats = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const followedByUser = await db
      .collection("followers")
      .countDocuments({ follower_id: new ObjectId(id) });
    const followingUser = await db
      .collection("followers")
      .countDocuments({ followed_id: new ObjectId(id) });
    res.status(200).json({
      followedByUser: followedByUser,
      followingUser: followingUser,
    });
  } catch (err) {
    console.error("Get follow stats by user error:", err);
    return res.status(500).json({ error: err.message });
  }
};
/**
 * GET /users/:follower_id/is_following/:followed_id
 *
 * Check if a user is following another user.
 *
 * Request parameters:
 * {
 *  follower_id: string,
 *  followed_id: string
 * }
 */
export const isUserFollowing = async (req, res) => {
  try {
    const db = await connectDB();
    const { follower_id, followed_id } = req.params;
    const filter = {
      follower_id: new ObjectId(follower_id),
      followed_id: new ObjectId(followed_id),
    };
    try {
      const count = await db.collection("followers").countDocuments(filter);
      res.status(200).json(count > 0);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (err) {
    console.error("Check following error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /users/follow/
 *
 * Creates a new follow relationship between two users.
 *
 * Request parameters:
 * {
 *  follower_id: string,
 *  followed_id: string
 * }
 */
export const createFollow = async (req, res) => {
  try {
    const db = await connectDB();
    const { follower_id, followed_id } = req.body;

    if (followed_id === follower_id) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const newFollow = {
      follower_id: new ObjectId(follower_id),
      followed_id: new ObjectId(followed_id),
    };
    const existing = await db.collection("followers").countDocuments(newFollow);
    if (existing > 0) {
      return res.status(409).json({ error: "Already following user" });
    }

    const result = await db.collection("followers").insertOne(newFollow);
    res.status(200).json(result);
  } catch (err) {
    console.error("Follow user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /users/:follower_id/unfollow/:followed_id
 *
 * Unfollows a user for the follower user.
 *
 * Request parameters:
 * {
 *  follower_id: string,
 *  followed_id: string
 * }
 */
export const unfollowUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { follower_id, followed_id } = req.params;
    const followToDelete = {
      follower_id: new ObjectId(follower_id),
      followed_id: new ObjectId(followed_id),
    };

    try {
      const result = await db.collection("followers").deleteOne(followToDelete);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (err) {
    console.error("Unfollow user error:", err);
    return res.status(500).json({ error: err.message });
  }
};
