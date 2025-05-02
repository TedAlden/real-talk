import { useState, useEffect } from "react";
import { getFollowersById, getFollowedById } from "../api/followersService.js";
import _ from "lodash";
import useAuth from "../hooks/useAuth.js";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";
import { useSearchParams } from "react-router-dom";

import { Spinner, Card, Tabs } from "flowbite-react";

function Network() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [viewerId, setViewerId] = useState();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    return tabParam === "following" ? "following" : "followers";
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await auth.getUser();
        setViewerId(user._id);
        
        // Fetch followers data
        const followersResponse = await getFollowersById(user._id, user._id);
        if (followersResponse.success !== false) {
          setFollowers(followersResponse.data);
        }
        
        // Fetch following data
        const followingResponse = await getFollowedById(user._id, user._id);
        if (followingResponse.success !== false) {
          setFollowing(followingResponse.data);
        }
      } catch (error) {
        console.error("Error fetching network data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "following" || tabParam === "followers") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const onFollowerChange = (targetId, isFollow) => {
    setFollowers((prev) => {
      return prev.map((user) => {
        if (user._id === targetId) {
          return { ...user, isFollowing: isFollow };
        }
        return user;
      });
    });
  };

  const onFollowingChange = (targetId, isFollow) => {
    setFollowing((prev) => {
      return prev.map((user) => {
        if (user._id === targetId) {
          return { ...user, isFollowing: isFollow };
        }
        return user;
      });
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return loading ? (
    <div className="p-16 text-center">
      <Spinner aria-label="Loading network data" size="xl" />
    </div>
  ) : (
    <div className="flex justify-center">
      <Card className="mt-16 w-2/5 text-gray-900 dark:text-white">
        <div className="mb-4">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              <li className="mr-2">
                <button
                  onClick={() => handleTabChange("followers")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "followers"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Followers
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => handleTabChange("following")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "following"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Following
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flow-root">
          {activeTab === "followers" && (
            <>
              <h5 className="text-xl font-bold leading-none mb-4">Followers</h5>
              {followers.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {followers.map((follower) => (
                    <li key={follower._id} className="py-3 sm:py-4">
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
                            className="text-lg font-semibold hover:underline"
                          >
                            @{follower.username}
                          </a>
                          <p className="text-sm font-normal italic text-gray-400">
                            0 mutual friends
                          </p>
                        </div>

                        <UserInteractionButtons
                          viewerId={viewerId}
                          targetId={follower._id}
                          onFollowChange={onFollowerChange}
                          isFollowing={follower.isFollowing}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No followers yet.</p>
              )}
            </>
          )}

          {activeTab === "following" && (
            <>
              <h5 className="text-xl font-bold leading-none mb-4">Following</h5>
              {following.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {following.map((followed) => (
                    <li key={followed._id} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <a href={`/profile/${followed._id}`} className="shrink-0">
                          <img
                            className="h-auto w-16 rounded-full object-cover shadow-lg"
                            src={followed?.profile_picture}
                            alt="Profile"
                          />
                        </a>
                        <div className="min-w-0 flex-1">
                          <a
                            href={`/profile/${followed._id}`}
                            className="text-lg font-semibold hover:underline"
                          >
                            @{followed.username}
                          </a>
                          <p className="text-sm font-normal italic text-gray-400">
                            0 mutual friends
                          </p>
                        </div>
                        <UserInteractionButtons
                          viewerId={viewerId}
                          targetId={followed._id}
                          onFollowChange={onFollowingChange}
                          isFollowing={followed.isFollowing}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Not following anyone yet.</p>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Network; 