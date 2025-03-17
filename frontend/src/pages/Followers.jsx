import { useState, useEffect } from "react";
import {
  getFollowersById,
  followUser,
  unfollowUser,
} from "../api/followersService.js";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import useAuth from "../hooks/useAuth.js";

import { Spinner, Card } from "flowbite-react";

function Followers() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const paramId = useParams().id;

  useEffect(() => {
    const fetchFollowerData = async () => {
      setLoading(true);
      try {
        const viewer = await auth.getUser();
        setCurrentUserId(viewer._id);
        const userId = paramId;
        const response = await getFollowersById(userId, viewer._id);

        if (response.success !== false) {
          setFollowers(response.data);
        }
      } catch (error) {
        console.error("Error fetching follower data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowerData();
  }, [auth, paramId, navigate]);

  const handleFollow = async (followed) => {
    const user = await auth.getUser();
    const userId = user._id;
    const followAction = followed.isFollowing ? unfollowUser : followUser;

    const response = await followAction(userId, followed._id);
    if (response.success !== false) {
      setFollowers(
        followers.map((f) => {
          if (f._id === followed._id) {
            return { ...f, isFollowing: !f.isFollowing };
          }
          return f;
        }),
      );
    }
  };

  const handleReport = () => {
    // Not implemented yet
  };

  return loading ? (
    <div className="p-16 text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  ) : (
    <div className="flex justify-center">
      <Card className="mt-16 w-2/5 text-gray-900 dark:text-white">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none">Followers</h5>
        </div>
        <div className="flow-root">
          {followers.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {followers.map((follower) => (
                <li key={follower.id} className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <a href={`/profile/${follower._id}`} className="shrink-0">
                      <img
                        className="h-auto w-16 rounded-full object-cover shadow-lg"
                        src={follower?.profile_picture}
                        alt="Profile"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <a
                        href={`/profile/${follower._id}`}
                        className="text-md font-semibold hover:underline"
                      >
                        @{follower.username}
                      </a>
                      <p className="text-sm font-normal italic text-gray-400">
                        0 mutual friends
                      </p>
                    </div>
                    {follower._id != currentUserId && (
                      <div className="inline-flex items-center gap-2 text-base font-semibold">
                        <button
                          onClick={() => handleFollow(follower)}
                          className={`w-full rounded-md px-4 py-1 text-sm font-medium transition sm:w-min ${
                            follower.isFollowing
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {follower.isFollowing ? "Unfollow" : "Follow"}
                        </button>
                        <button
                          onClick={handleReport}
                          className={
                            "w-full rounded-md bg-red-500 px-4 py-1 text-sm font-medium transition hover:bg-red-600 sm:w-min"
                          }
                        >
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No followers yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Followers;
