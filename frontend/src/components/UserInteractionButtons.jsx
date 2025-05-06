import { useState, useEffect } from "react";
import { followUser, unfollowUser } from "../api/followersService.js";

/**
 * Buttons for user interactions (follow/unfollow/report)
 * @param {string} viewerId - ID of current user
 * @param {string} targetId - ID of user being interacted with
 * @param {Function} onFollowChange - Callback when follow state changes
 * @param {boolean} isFollowing - Initial follow state
 * @param {string} mode - Display mode ('default' or 'follow')
 */
function UserInteractionButtons({
  viewerId,
  targetId,
  onFollowChange,
  isFollowing,
  mode = "follow",
}) {
  // Track loading and follow states
  const [loading, setLoading] = useState(false);
  const [followState, setFollowState] = useState(false);

  // Update follow state when props change
  useEffect(() => {
    setFollowState(isFollowing);
  }, [targetId, isFollowing]);

  if (viewerId === targetId) return null;

  // Handle follow/unfollow action
  const handleFollowAction = async () => {
    if (loading) return;

    const previousState = followState;
    setFollowState(!followState);
    setLoading(true);

    try {
      const followAction = previousState ? unfollowUser : followUser;
      const response = await followAction(viewerId, targetId);

      if (response.success === false) {
        setFollowState(previousState);
        console.error("Follow failed:", response);
      } else {
        if (onFollowChange) onFollowChange(targetId, !previousState);
      }
    } catch (error) {
      setFollowState(previousState);
      console.error("Error during follow:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    // Not implemented yet
    console.log("Report action triggered");
  };

  const buttonClasses = `
    w-full rounded-md px-3 py-1.5 transition sm:w-min
    ${followState ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
    ${loading ? "opacity-70 cursor-not-allowed" : ""} 
  `;

  return (
    <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
      <button
        onClick={handleFollowAction}
        className={buttonClasses}
        disabled={loading}
      >
        {followState ? "Unfollow" : "Follow"}
      </button>
      {mode !== "follow" && (
        <button
          onClick={handleReport}
          className={buttonClasses + " bg-red-500 hover:bg-red-600"}
        >
          Report
        </button>
      )}
    </div>
  );
}

export default UserInteractionButtons;
