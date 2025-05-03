import { useState, useCallback, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { getNotificationsById, deleteNotification } from "../api/notificationService.js";
import useAuth from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();

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
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
        {notifications.length > 0 && (
          <button 
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => {
              // TODO: Implement mark all as read functionality
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              key={notification._id}
            >
              <div className="flex-1">
                <a
                  className="text-md font-semibold text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline"
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
