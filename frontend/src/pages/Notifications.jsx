import { useState, useCallback, useEffect } from "react";
import { HiX } from "react-icons/hi";
import {
  getNotificationsById,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notificationService.js";
import useAuth from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { Spinner, Tooltip } from "flowbite-react";
import Unauthorised from "../components/Unauthorised.jsx";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const getNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await auth.getUser();
      if (!user || !user._id) return;

      const response = await getNotificationsById(user._id);
      if (response.success !== false) {
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("An error occurred while fetching notifications");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    getNotifications();
  }, [navigate, getNotifications]);

  const onDelete = async (timestamp) => {
    try {
      const oldNotifications = [...notifications];
      const userId = (await auth.getUser())._id;
      const response = await deleteNotification(userId, timestamp);

      if (response.success !== false) {
        setNotifications(notifications.filter((n) => n._id !== timestamp));
      } else {
        setNotifications(oldNotifications);
        setError("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("An error occurred while deleting notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const userId = (await auth.getUser())._id;
      if (!userId) return;

      const oldNotifications = [...notifications];
      const response = await deleteAllNotifications(userId);

      if (response.success !== false) {
        setNotifications([]);
        // Refresh Layout component to update notification badge
        window.location.reload();
      } else {
        setNotifications(oldNotifications);
        setError("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      setError("An error occurred while marking all as read");
    } finally {
      setLoading(false);
    }
  };

  if (!auth.loggedIn) return <Unauthorised />;

  if (loading)
    return (
      <div className="p-16 text-center">
        <Spinner aria-label="Loading notifications data" size="xl" />
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
        <Tooltip
          content={
            notifications.length > 0
              ? "Mark all notifications as read"
              : "No notifications to mark as read"
          }
        >
          <button
            className={`${
              notifications.length > 0
                ? "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                : "cursor-not-allowed text-gray-400 dark:text-gray-600"
            }`}
            onClick={markAllAsRead}
            disabled={notifications.length === 0}
          >
            Mark all as read
          </button>
        </Tooltip>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md dark:bg-gray-800"
              key={notification._id}
            >
              <div className="flex-1">
                <a
                  className="text-md font-semibold text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                  href={`/profile/${notification.actor_id}`}
                >
                  {"@" + notification.actor_username}
                </a>
                <span className="text-gray-600 dark:text-gray-300">
                  {notification.content}
                </span>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                onClick={() => onDelete(notification._id)}
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
