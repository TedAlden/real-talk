import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";
import { createNotification } from "./notifications.js";

export const setLike = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { userId, isLiked } = req.body;

    // TODO: userId should be passed from auth middleware when implemented

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
    }

    // If isLiked is not valid boolean
    if (typeof isLiked !== "boolean") {
      return res.status(400).json({ message: ErrorMsg.INVALID_LIKE_VALUE });
    }

    // Add userId to likes array if isLiked is true, or remove userId from likes
    // array if isLiked is false
    const update = isLiked
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    // Update post
    const result = await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(id) }, update);

    if (result.acknowledged) {
      createNotification(post.user_id, userId, "like");
      return res.status(200).json({
        message: SuccessMsg.LIKE_UPDATE_OK,
        isLiked,
      });
    } else {
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error("Set like error:", err);
    return res.status(500).json({ error: err.message });
  }
};
