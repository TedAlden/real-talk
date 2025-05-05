import React from "react";
import { useEffect, useState } from "react";
import UserInteractionButtons from "./UserInteractionButtons";
import { getSuggestedFollows } from "../api/followersService";
import { Link } from "react-router-dom";

export default function SuggestedUsers({ viewer, method = "mutuals" }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
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
    "p-6 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800";
  return (
    <div className={`${cardStyle} mb-5 w-full text-gray-900 dark:text-white`}>
      <h1 className="mb-3 text-xl font-bold">Suggested Users</h1>
      <div className="flow-root p-4">
        {suggestions.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {suggestions.map((user) => (
              <li key={user._id} className="flex shrink-0 flex-col py-3">
                <div className="flex flex-row items-center justify-between">
                  <Link to={`/profile/${user._id}`} className="shrink-0">
                    <img
                      className="size-16 rounded-full object-cover shadow-lg"
                      src={user?.profile_picture}
                      alt="Profile"
                    />
                  </Link>
                  <div className="mx-3 flex flex-grow flex-col text-left">
                    <Link
                      to={`/profile/${user._id}`}
                      className="min-w-40 overflow-hidden text-ellipsis text-lg font-semibold hover:underline"
                    >
                      @{user.username}
                    </Link>
                    <span className="text-md text-gray-500 dark:text-gray-400">
                      {user.mutualCount > 1
                        ? `${user.mutualCount} mutual follows`
                        : `${user.mutualCount} mutual follow`}
                    </span>
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
