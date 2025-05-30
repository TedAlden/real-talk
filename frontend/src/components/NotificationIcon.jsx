import { Button, Popover, List } from "flowbite-react";
import { HiBell, HiX } from "react-icons/hi";
import { useState, useCallback, useEffect } from "react";
import {
  getNotificationsById,
  deleteNotification,
} from "../api/notificationService.js";
import useAuth from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

/**
 * Notification bell component with dropdown for user notifications
 * Shows count of unread notifications and allows deletion
 */
export default function Notifications() {
  // Track notifications list
  const [notifications, setNotifications] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();

  // Fetch notifications for current user
  const getNotifications = useCallback(async () => {
    try {
      const user = await auth.getUser();
      if (!user || !user._id) return;

      const response = await getNotificationsById(user._id);
      if (response.success !== false) {
        setNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [auth]);

  // Load notifications on mount and route changes
  useEffect(() => {
    getNotifications();
  }, [navigate, getNotifications]);

  // Handle notification deletion
  const onDelete = async (timestamp) => {
    try {
      const oldNotifications = [...notifications];
      const userId = (await auth.getUser())._id;
      const response = await deleteNotification(userId, timestamp);

      if (response.success !== false) {
        setNotifications(notifications.filter((n) => n._id !== timestamp));
      } else {
        setNotifications(oldNotifications);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
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
          <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
            <h3
              id="default-popover"
              className="font-semibold text-gray-900 dark:text-white"
            >
              Notifications
            </h3>
          </div>
          <List className="">
            {notifications?.map((notification) => (
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
            ))}
          </List>
        </div>
      }
    >
      {/* Notification bell with counter */}
      <button
        className="relative p-1 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 text-gray-500"
        onClick={getNotifications}
      >
        {!!notifications.length && (
          <div className="absolute -bottom-1 -right-1 size-[14px] rounded-sm bg-red-500 text-[10px] font-bold text-white">
            {notifications.length}
          </div>
        )}

        <HiBell className="size-5" />
      </button>
    </Popover>
  );
}
