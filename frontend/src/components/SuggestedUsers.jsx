import React from "react";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import UserInteractionButtons from "./UserInteractionButtons";
import { getSuggestedFollows } from "../api/followersService";

export default function SuggestedUsers({ method = "mutuals" }) {
  const auth = useAuth();
  const [viewer, setViewer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    auth.getUser().then((user) => {
      setViewer(user);
    });
  }, [auth]);

  const fetchSuggestions = async () => {
    if (!viewer) return;
    try {
      const response = await getSuggestedFollows(viewer._id, method);

      if (response.success !== false) {
        const suggestedUsers = response.data.map((user) => ({
          ...user,
          isFollowing: false,
        }));
        setSuggestions(suggestedUsers);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [viewer, method]);

  const onFollowChange = async (userId, isFollowing) => {
    const updatedSuggestions = suggestions.map((user) =>
      user._id === userId ? { ...user, isFollowing } : user,
    );
    setSuggestions(updatedSuggestions);
  };

  if (method !== "mutuals" && method !== "areas" && method !== "interests") {
    console.error(
      "Invalid method provided. Use 'mutuals', 'areas', or 'interests'.",
    );
    return null;
  }
  const cardStyle =
    "p-4 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800";
  return (
    <div className={`${cardStyle} mb-5 text-gray-900 dark:text-white`}>
      <h1 className="mb-3 text-xl font-bold">Suggested Users</h1>
      <div className="flow-root p-4">
        {suggestions.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {suggestions.map((user) => (
              <li key={user._id} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <a href={`/profile/${user._id}`} className="shrink-0">
                    <img
                      className="h-auto w-16 rounded-full object-cover shadow-lg"
                      src={user?.profile_picture}
                      alt="Profile"
                    />
                  </a>
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/profile/${user._id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      @{user.username}
                    </a>
                    <p className="text-md text-gray-500 dark:text-gray-400">
                      {user.mutualCount > 1
                        ? `${user.mutualCount} mutual follows`
                        : `${user.mutualCount} mutual follow`}
                    </p>
                  </div>
                  <UserInteractionButtons
                    viewerId={viewer._id}
                    targetId={user._id}
                    onFollowChange={onFollowChange}
                    isFollowing={user.isFollowing}
                    mode="follow"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No suggested users.</p>
        )}
      </div>
    </div>
  );
}
