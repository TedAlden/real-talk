import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg } from "../services/responseMessages.js";
import { createNotification } from "./notifications.js";
import _ from "lodash";
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
  const maxSuggestions = 10;
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { method } = req.query;
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(400).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    const followeds = await db
      .collection("followers")
      .find({ follower_id: new ObjectId(id) })
      .toArray();
    const followeds_ids = followeds.map((f) => f.followed_id);
    const excludeIds = [user._id, ...followeds_ids];

    if (method === "mutuals") {
      const topMutualFollowers = await db
        .collection("followers")
        .aggregate([
          {
            $match: {
              followed_id: { $in: followeds_ids },
              follower_id: { $nin: excludeIds },
            },
          },
          {
            $group: {
              _id: "$follower_id",
              mutualCount: { $sum: 1 },
            },
          },
          { $sort: { mutualCount: -1 } },
          { $limit: maxSuggestions },
        ])
        .toArray();

      const topIds = topMutualFollowers.map((user) => user._id);
      const mutualCountMap = _.keyBy(topMutualFollowers, "_id");

      const suggestedMutuals = await db
        .collection("users")
        .find({ _id: { $in: topIds } })
        .toArray();

      suggestedMutuals.forEach((user) => {
        user.mutualCount = mutualCountMap[user._id].mutualCount;
      });

      const sortedMutuals = _.orderBy(
        suggestedMutuals,
        ["mutualCount"],
        ["desc"]
      );

      return res.status(200).json(sortedMutuals);
    }

    if (method === "area") {
      const nearbyUsers = await db
        .collection("users")
        .find({
          "address.city": user.address.city,
          _id: { $nin: excludeIds },
        })
        .toArray();
      const suggestedNearbyUsers = _.sampleSize(nearbyUsers, maxSuggestions);
      return res.status(200).json(suggestedNearbyUsers);
    }

    if (method === "interests") {
      const likedPosts = await db
        .collection("posts")
        .aggregate([
          { $unwind: "$tags" },
          { $unwind: "$likes" },
          {
            $group: {
              _id: { userId: "$likes", tag: "$tags" },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              userId: "$_id.userId",
              tag: "$_id.tag",
              likeCount: "$count",
            },
          },
        ])
        .toArray();

      //score by how many times user liked a post with that tag
      const tagScores = likedPosts
        .filter((post) => post.userId.toString() === id.toString())
        .reduce((acc, { tag, likeCount }) => {
          acc[tag] = likeCount;
          return acc;
        }, {});
      const excludeIDsStr = excludeIds.map((oid) => oid.toString());
      const filteredPosts = likedPosts.filter(
        (post) => !excludeIDsStr.includes(post.userId.toString())
      );

      const userScores = filteredPosts.reduce((acc, post) => {
        if (!tagScores[post.tag]) {
          return acc;
        }
        acc[post.userId] =
          (acc[post.userId] || 0) + tagScores[post.tag] * post.likeCount;
        return acc;
      }, {});

      const topScorers = _.chain(userScores)
        .toPairs()
        .orderBy([1], ["desc"])
        .take(maxSuggestions)
        .map(0)
        .value();

      const topScorerOids = topScorers.map((id) => new ObjectId(id));

      const topUsers = await db
        .collection("users")
        .find({ _id: { $in: topScorerOids } })
        .toArray();

      const similarInterestUsers = topUsers.map((user) => {
        return {
          ...user,
          interestScore: userScores[user._id],
        };
      });

      return res.status(200).json(similarInterestUsers);
    }

    return res.status(400).json({ error: "Invalid method" });
  } catch (err) {
    console.error("Get suggested follows error:", err);
    return res.status(500).json({ error: err.message });
  }
};
