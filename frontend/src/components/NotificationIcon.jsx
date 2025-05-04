import { Button, Popover, List, Tooltip } from "flowbite-react";
import { HiBell, HiX } from "react-icons/hi";
import { useState, useCallback, useEffect } from "react";
import {
  getNotificationsById,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notificationService.js";
import useAuth from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const getNotifications = useCallback(async () => {
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
        setError("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      setError("An error occurred while marking all as read");
    }
  };

  return (
    <Popover
      aria-labelledby="default-popover"
      data-testid="notification-icon"
      arrow={false}
      placement="bottom-end"
      content={
        <div className="w-96 text-sm text-gray-500 dark:text-gray-400">
          <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 flex justify-between items-center">
            <h3
              id="default-popover"
              className="font-semibold text-gray-900 dark:text-white"
            >
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {error && (
            <div className="p-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          
          <List className="">
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            ) : (
              notifications?.map((notification) => (
                <div
                  className="flex items-center space-x-2 divide-gray-200 px-3 py-2 dark:divide-gray-700"
                  key={notification._id}
                >
                  <div className="flex-1">
                    <a
                      className="text-md font-semibold hover:text-gray-900 dark:hover:text-white hover:underline"
                      href={`/profile/${notification.actor_id}`}
                    >
                      {"@" + notification.actor_username}
                    </a>
                    <span>{notification.content}</span>
                  </div>

                  <button
                    className="p-2 text-gray-500 hover:text-white"
                    onClick={() => onDelete(notification._id)}
                  >
                    <HiX className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </List>
        </div>
      }
    >
      <button
        className="relative p-1 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 text-gray-500"
        onClick={getNotifications}
      >
        {!!notifications.length && (
          <div className="absolute -top-1 right-0 size-4 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          </div>
        )}

        <HiBell className="size-5" />
      </button>
    </Popover>
  );
}
