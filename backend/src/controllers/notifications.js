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
      like: " has liked your post.",
      comment: " has commented on your post.",
      follow: " has started following you.",
    };

    const notification = {
      timestamp: Date.now(),
      actor_id,
      content: actor.username + message[type],
      read: false,
    };

    const updatedUser = {
      ...target,
      notifications: [notification, ...target.notifications],
    };

    // Update target
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, updatedUser);

    if (!result.acknowledged) {
      throw new Error(ErrorMsg.NOTIFICATION_ERROR);
    }
    return true;
  } catch (err) {
    console.error("Notification creation error:", err);
    return false;
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { timestamp } = req.body;

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: ErrorMsg.INVALID_ID });
    }

    const newNotifications = user.notifications.filter(
      (notification) => notification.timestamp !== timestamp
    );

    if (newNotifications.length === user.notifications.length) {
      return res.status(404).json({ message: ErrorMsg.NO_SUCH_NOTIFICATION });
    }

    const updatedUser = {
      ...user,
      notifications: newNotifications,
    };

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, updatedUser);

    if (!result.acknowledged) {
      throw new Error("Unable to update user notifications.");
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
    const { id } = req.params;
    const { timestamp } = req.body;

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

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
      .updateOne({ _id: new ObjectId(id) }, updatedUser);

    if (!result.acknowledged) {
      return res.status(500).json({ message: ErrorMsg.NOTIFICATION_ERROR });
    }

    return res.status(200).json({ message: SuccessMsg.NOTIFICATION_DELETE_OK });
  } catch (err) {
    console.error("Delete notification error:", err);
    return res.status(500).json({ error: err.message });
  }
};
