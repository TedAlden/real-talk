import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";

export const createReport = async (req, res) => {
  try {
    const db = await connectDB();
    const { reporter, target, targetType, content } = req.body;
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(reporter._id) });

    if (!user) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_ID });
    }

    switch (targetType) {
      case "post":
        const post = await db
          .collection("posts")
          .findOne({ _id: new ObjectId(target) });
        if (!post) {
          return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
        }
        break;
      case "user":
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(target) });
        if (!user) {
          return res.status(404).json({ message: ErrorMsg.NO_SUCH_ID });
        }
        break;
      case "comment":
        const commentPost = await db
          .collection("posts")
          .findOne({ "comments.comment_id": new ObjectId(target.comment_id) });
        if (!commentPost) {
          return res.status(404).json({ message: ErrorMsg.NO_SUCH_COMMENT });
        }
        break;
      default:
        return res.status(400).json({ message: ErrorMsg.INVALID_REPORT_TYPE });
    }
    const newReport = {
      target: target,
      targetType: targetType,
      reporter: {
        _id: reporter._id,
        username: reporter.username,
      },
      timestamp: new Date(),
      content: content,
      status: "active",
    };

    const result = await db.collection("reports").insertOne(newReport);
    if (!result.acknowledged) {
      return res.status(500).json({ error: ErrorMsg.REPORT_CREATE_ERROR });
    }

    return res.status(200).json({
      message: SuccessMsg.REPORT_CREATE_OK,
    });
  } catch (err) {
    console.error("Report creation error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const db = await connectDB();
    const reports = await db.collection("reports").find().toArray();
    return res.status(200).json(reports);
  } catch (err) {
    console.error("Get reports error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db
      .collection("reports")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.REPORT_DELETE_ERROR });
    }

    return res.status(200).json({ error: SuccessMsg.REPORT_DELETE_OK });
  } catch (err) {
    console.error("Delete report error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "resolved" && status !== "active") {
      return res.status(400).json({ error: ErrorMsg.INVALID_REPORT_TYPE });
    }

    const result = await db
      .collection("reports")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.REPORT_UPDATE_ERROR });
    }

    return res.status(200).json({ error: SuccessMsg.REPORT_UPDATE_OK });
  } catch (err) {
    console.error("Update report status error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { userId, is_banned } = req.body;

    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { is_banned: is_banned } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.BAN_ERROR });
    }

    return res.status(200).json({ error: SuccessMsg.USER_BAN_OK });
  } catch (err) {
    console.error("Ban user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const banPost = async (req, res) => {
  try {
    const db = await connectDB();
    const { postId, is_banned } = req.body;

    const result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $set: { is_banned: is_banned } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_POST });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.BAN_ERROR });
    }

    return res.status(200).json({ error: SuccessMsg.POST_BAN_OK });
  } catch (err) {
    console.error("Ban post error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const banComment = async (req, res) => {
  try {
    const db = await connectDB();
    const { commentId, is_banned } = req.body;

    const result = await db
      .collection("posts")
      .updateOne(
        { "comments.comment_id": new ObjectId(commentId) },
        { $set: { "comments.$.is_banned": is_banned } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_COMMENT });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: ErrorMsg.BAN_ERROR });
    }

    return res.status(200).json({ error: SuccessMsg.COMMENT_BAN_OK });
  } catch (err) {
    console.error("Ban comment error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const banTarget = async (req, res) => {
  try {
    const db = await connectDB();
    const { is_banned, targetType, targetId } = req.body;
    let result;
    switch (targetType) {
      case "post":
        result = await db
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(targetId) },
            { $set: { is_banned: is_banned } }
          );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: ErrorMsg.NO_SUCH_POST });
        }
        break;

      case "user":
        result = await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(targetId) },
            { $set: { is_banned: is_banned } }
          );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: ErrorMsg.NO_SUCH_ID });
        }
        break;

      case "comment":
        const commentPost = await db
          .collection("posts")
          .findOne({ "comments.comment_id": new ObjectId(targetId) });

        if (!commentPost) {
          return res.status(404).json({ message: ErrorMsg.NO_SUCH_COMMENT });
        }
        result = await db
          .collection("posts")
          .updateOne(
            { "comments.comment_id": new ObjectId(targetId) },
            { $set: { "comments.$.is_banned": is_banned } }
          );

        break;

      default:
        return res.status(400).json({ message: ErrorMsg.INVALID_REPORT_TYPE });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: ErrorMsg.BAN_ERROR });
    }

    return res.status(200).json({ message: SuccessMsg.REPORT_BAN_OK });
  } catch (err) {
    console.error("Ban target error:", err);
    return res.status(500).json({ error: err.message });
  }
};
