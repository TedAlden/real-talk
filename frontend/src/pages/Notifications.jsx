import { useState, useCallback, useEffect } from "react";
import { HiX } from "react-icons/hi";
import {
  getNotificationsById,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notificationService.js";
import useAuth from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import Unauthorised from "../components/Unauthorised.jsx";

// Custom event for notification updates
export const NOTIFICATION_UPDATE_EVENT = "notification-update";

/**
 * Displays and manages user notifications
 * Handles notification deletion and mark-all-read functionality
 */
export default function NotificationsPage() {
  // State management
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  // Fetch notifications from API
  const getNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const user = await auth.getUser();
      if (!user || !user._id) return;

      const response = await getNotificationsById(user._id);
      if (response.success !== false) {
        setNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // Load notifications on mount and navigation
  useEffect(() => {
    getNotifications();
  }, [navigate, getNotifications]);

  // Handle single notification deletion
  const onDelete = async (timestamp) => {
    try {
      const oldNotifications = [...notifications];
      const userId = (await auth.getUser())._id;
      const response = await deleteNotification(userId, timestamp);

      if (response.success !== false) {
        const updatedNotifications = notifications.filter((n) => n._id !== timestamp);
        setNotifications(updatedNotifications);
        
        window.dispatchEvent(new CustomEvent(NOTIFICATION_UPDATE_EVENT, { 
          detail: { count: updatedNotifications.length } 
        }));
      } else {
        setNotifications(oldNotifications);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = (await auth.getUser())._id;
      const response = await deleteAllNotifications(userId);
      
      if (response.success !== false) {
        setNotifications([]);
        
        window.dispatchEvent(new CustomEvent(NOTIFICATION_UPDATE_EVENT, { 
          detail: { count: 0 } 
        }));
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
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
        {notifications.length > 0 && (
          <button
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No notifications yet
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
