import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";

export const createNotification = async (target_id, actor_id, type) => {
  try {
    const db = await connectDB();

    const target = await db
      .collection("users")
      .findOne({ _id: new ObjectId(target_id) });

    if (!target) {
      throw new Error(ErrorMsg.NO_SUCH_USER + "(target)");
    }

    const actor = await db
      .collection("users")
      .findOne({ _id: new ObjectId(actor_id) });

    if (!actor) {
      throw new Error(ErrorMsg.NO_SUCH_USER + "(actor)");
    }

    const message = {
      like: "  liked your post.",
      comment: " commented on your post.",
      follow: " followed you.",
    };

    const notification = {
      _id: new ObjectId(),
      actor_id: new ObjectId(actor_id),
      actor_username: actor.username,
      content: message[type],
      read: false,
    };

    // Update target
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(target_id) },
        { $push: { notifications: notification } }
      );

    if (!result.acknowledged) {
      throw new Error(ErrorMsg.NOTIFICATION_ERROR);
    }
    return true;
  } catch (err) {
    console.error("Notification creation error:", err);
    return false;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const db = await connectDB();
    const { user_id } = req.params;

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user_id) });

    if (!user) {
      return res.status(404).json({ message: ErrorMsg.INVALID_ID });
    }

    return res.status(200).json(user.notifications);
  } catch (err) {
    console.error("Get notifications error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const db = await connectDB();
    const { user_id, notification_id } = req.params;
    console.log("Delete notification:", user_id, notification_id);
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(user_id) },
        { $pull: { notifications: { _id: new ObjectId(notification_id) } } }
      );

    if (result.modifiedCount === 0) {
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(user_id) });

      if (!user) {
        return res.status(404).json({ message: ErrorMsg.INVALID_ID });
      }
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_NOTIFICATION });
    }

    return res.status(200).json({ message: SuccessMsg.NOTIFICATION_DELETE_OK });
  } catch (err) {
    console.error("Delete notification error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const readNotification = async (req, res) => {
  try {
    const db = await connectDB();
    const { user_id, timestamp } = req.params;

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user_id) });

    if (!user) {
      return res.status(404).json({ message: ErrorMsg.INVALID_ID });
    }

    let notificationExists = false;

    const newNotifications = user.notifications.map((notification) => {
      if (notification.timestamp === timestamp) {
        notificationExists = true;
        return { ...notification, read: true };
      }
      return notification;
    });

    if (!notificationExists) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_NOTIFICATION });
    }

    const updatedUser = {
      ...user,
      notifications: newNotifications,
    };

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(user_id) }, updatedUser);

    if (!result.acknowledged) {
      return res.status(500).json({ message: ErrorMsg.NOTIFICATION_ERROR });
    }

    return res.status(200).json({ message: SuccessMsg.NOTIFICATION_DELETE_OK });
  } catch (err) {
    console.error("Delete notification error:", err);
    return res.status(500).json({ error: err.message });
  }
};
