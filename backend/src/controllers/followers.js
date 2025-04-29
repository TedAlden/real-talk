import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg } from "../services/responseMessages.js";
import { createNotification } from "./notifications.js";
import { sampleWithoutReplacement, getTopN } from "../services/algorithms.js";

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
    const viewerId = viewer_id || id;

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
      .find({ follower_id: new ObjectId(viewerId) })
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
    const count = await db.collection("followers").countDocuments(filter);
    res.status(200).json(count > 0);
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
      return res.status(400).json({ error: ErrorMsg.FOLLOW_SELF_ERROR });
    }

    const newFollow = {
      follower_id: new ObjectId(follower_id),
      followed_id: new ObjectId(followed_id),
    };
    const existing = await db.collection("followers").countDocuments(newFollow);
    if (existing > 0) {
      return res.status(409).json({ error: ErrorMsg.ALREADY_FOLLOWING });
    }

    const result = await db.collection("followers").insertOne(newFollow);
    createNotification(followed_id, follower_id, "follow");

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

    const result = await db.collection("followers").deleteOne(followToDelete);
    res.status(200).json(result);
  } catch (err) {
    console.error("Unfollow user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getSuggestedFollows = async (req, res) => {
  try {
    const db = await connectDB();
    const { id, method } = req.params;
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(400).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    if (method === "mutuals") {
      const graph = await db
        .collection("followers")
        .aggregate([
          {
            $graphLookup: {
              from: "followers",
              startWith: "$followed_id",
              connectFromField: "followed_id",
              connectToField: "follower_id",
              as: "connections",
              maxDepth: 2,
            },
          },
          { $match: { follower_id: new ObjectId(id) } },
        ])
        .toArray();

      const mutuals = graph.flatMap((g) => g.connections);
      const mutualsIds = mutuals.map((m) => m.follower_id);
      const uniqueMutuals = [...new Set(mutualsIds)];
      const suggestedMutuals = await db
        .collection("users")
        .find({ _id: { $in: uniqueMutuals } })
        .toArray();
      res.status(200).json(suggestedMutuals);
    }

    if (method === "area") {
      const nearbyUsers = await db
        .collection("users")
        .find({
          "address.city": user.address.city,
          _id: { $ne: user._id },
        })
        .toArray();
      const suggestedNearbyUsers = sampleWithoutReplacement(nearbyUsers, 10);
      res.status(200).json(suggestedNearbyUsers);
    }

    if (method === "interests") {
      const likedPosts = await db
        .collection("posts")
        .find({ likes: new ObjectId(id) })
        .toArray();

      const likedTags = likedPosts.flatMap((post) => post.tags);
      //score by how many times user liked a post with that tag
      const tagScores = likedTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const likingUsers = likedPosts.flatMap((post) => post.likes);
      //users get the tag's score every time they liked a post with that tag
      const userScores = likingUsers.reduce((acc, user) => {
        acc[user] = (acc[user] || 0) + tagScores[post.tags];
        return acc;
      }, {});

      const topScorers = getTopN(userScores, 10);

      const similarInterestUsers = await db
        .collection("users")
        .find({ _id: { $in: topScorers } })
        .toArray();

      res.status(200).json(similarInterestUsers);
    }

    return res.status(400).json({ error: "Invalid method" });
  } catch (err) {
    console.error("Unfollow user error:", err);
    return res.status(500).json({ error: err.message });
  }
};
