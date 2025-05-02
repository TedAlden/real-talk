import express from "express";
import { useValidators } from "../services/validation.js";
import {
  getNotifications,
  createNotification,
  readNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notifications.js";

const notifyRouter = express.Router();

notifyRouter.post("/:user_id/notifications", createNotification);
notifyRouter.get("/:user_id/notifications", getNotifications);
notifyRouter.patch("/:user_id/notifications", readNotification);
notifyRouter.delete(
  "/:user_id/notifications/:notification_id",
  deleteNotification
);
notifyRouter.delete("/:user_id/notifications", deleteAllNotifications);

export default notifyRouter;
