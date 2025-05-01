import { useState, useEffect } from "react";
import { getFollowersById } from "../api/followersService.js";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import useAuth from "../hooks/useAuth.js";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";

import { Spinner, Card } from "flowbite-react";

function Followers() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState(false);
  const [viewerId, setCurrentUserId] = useState();
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

  const onFollowChange = (targetId, isFollow) => {
    setFollowers((prev) => {
      return prev.map((user) => {
        if (user._id === targetId) {
          return { ...user, isFollowing: isFollow };
        }
        return user;
      });
    });
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

                    <UserInteractionButtons
                      viewerId={viewerId}
                      targetId={follower._id}
                      onFollowChange={onFollowChange}
                      isFollowing={follower.isFollowing}
                    />
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
