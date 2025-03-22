import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";

export const createComment = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { userId, content } = req.body;

    // TODO: userId should be passed from auth middleware when implemented

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
    }

    // Create comment object
    const comment = {
      comment_id: new ObjectId(),
      user_id: new ObjectId(userId),
      content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Add comment
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: comment } }
    );

    if (result.acknowledged) {
      return res.status(201).json({ message: SuccessMsg.COMMENT_CREATE_OK });
    } else {
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error("Create comment error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
    }

    return res.status(200).json(post.comments);
  } catch (err) {
    console.error("Get comments error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const db = await connectDB();
    const { id, commentId } = req.params;

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
    }

    // Check if comment exists
    const comment = post.comments.find(
      (comment) => comment.comment_id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_COMMENT });
    }

    return res.status(200).json(comment);
  } catch (err) {
    console.error("Get comment by ID error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const db = await connectDB();
    const { id, commentId } = req.params;
    const { content } = req.body;

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
    }

    // Check if comment exists
    const comment = post.comments.find(
      (comment) => comment.comment_id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_COMMENT });
    }

    // Update comment
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id), "comments.comment_id": new ObjectId(commentId) },
      { $set: { "comments.$.content": content, "comments.$.updated_at": new Date() } }
    );

    if (result.acknowledged) {
      return res.status(201).json({ message: SuccessMsg.COMMENT_UPDATE_OK });
    } else {
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error("Update comment error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const db = await connectDB();
    const { id, commentId } = req.params;

    // Check if post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
    }

    // Check if comment exists
    const comment = post.comments.find(
      (comment) => comment.comment_id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_COMMENT });
    }

    // Delete comment
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $pull: { comments: { comment_id: new ObjectId(commentId) } } }
    );

    if (result.acknowledged) {
      return res.status(204).json({ message: SuccessMsg.COMMENT_DELETE_OK });
    } else {
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error("Delete comment error:", err);
    return res.status(500).json({ error: err.message });
  }
};
