import { useState, useEffect } from "react";
import { getFollowersById, getFollowedById } from "../api/followersService.js";
import _ from "lodash";
import useAuth from "../hooks/useAuth.js";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";
import Unauthorised from "../components/Unauthorised.jsx";
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

        // Get userId from URL params or default to current user
        const userId = searchParams.get("userId") || user._id;

        // Fetch followers data
        const followersResponse = await getFollowersById(userId, user._id);
        if (followersResponse.success !== false) {
          setFollowers(followersResponse.data);
        }

        const followingResponse = await getFollowedById(userId, user._id);
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
  }, [auth, searchParams]);

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
    // Preserve the userId parameter when changing tabs
    const userId = searchParams.get("userId");
    const newParams = { tab };

    if (userId) {
      newParams.userId = userId;
    }

    setActiveTab(tab);
    setSearchParams(newParams);
  };

  if (!auth.loggedIn) return <Unauthorised />;

  if (loading)
    return (
      <div className="p-16 text-center">
        <Spinner aria-label="Loading network data" size="xl" />
      </div>
    );

  return (
    <div className="flex justify-center">
      <Card className="w-full text-gray-900 dark:text-white lg:mt-16 lg:w-3/5 2xl:w-1/2">
        <div className="mb-4">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
              <li className="mr-2">
                <button
                  onClick={() => handleTabChange("followers")}
                  className={`inline-block rounded-t-lg border-b-2 p-4 ${
                    activeTab === "followers"
                      ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                      : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  Followers
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => handleTabChange("following")}
                  className={`inline-block rounded-t-lg border-b-2 p-4 ${
                    activeTab === "following"
                      ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                      : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
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
              <h5 className="mb-4 text-xl font-bold leading-none">Followers</h5>
              {followers.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {followers.map((follower) => (
                    <li key={follower._id} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <a
                          href={`/profile/${follower._id}`}
                          className="shrink-0"
                        >
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
              <h5 className="mb-4 text-xl font-bold leading-none">Following</h5>
              {following.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {following.map((followed) => (
                    <li key={followed._id} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <a
                          href={`/profile/${followed._id}`}
                          className="shrink-0"
                        >
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
