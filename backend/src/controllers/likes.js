import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";

export const setLike = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { userId, isLiked } = req.body;

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404); // Not found
    }

    // If isLiked is not valid boolean
    if (typeof isLiked !== "boolean") {
      return res.sendStatus(400); // Bad request
    }

    // Add userId to likes array if isLiked is true, or remove userId from likes
    // array if isLiked is false
    const update = isLiked
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    // Update post
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      update
    );

    if (result.acknowledged) {
      console.log("Set like success");
      return res.status(200).json({
        message: "Like updated successfully",
        isLiked
      });
    } else {
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error("Set like error:", err);
    return res.status(500).json({ error: err.message });
  }
};
