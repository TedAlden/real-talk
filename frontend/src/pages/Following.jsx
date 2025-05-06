import { useState, useEffect } from "react";
import { getFollowedById } from "../api/followersService.js";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import useAuth from "../hooks/useAuth.js";
import Unauthorised from "../components/Unauthorised.jsx";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";
import { Spinner, Card } from "flowbite-react";

/**
 * Displays list of users being followed by a specific user
 * Includes follow/unfollow functionality
 */
function Following() {
  // Navigation and auth setup
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Track loading and followed users state
  const [loading, setLoading] = useState(true);
  const [followeds, setFolloweds] = useState(false);
  const [viewerId, setViewerId] = useState();
  const paramId = useParams().id;

  // Load followed users data on mount
  useEffect(() => {
    const fetchFollowedsData = async () => {
      try {
        setLoading(true);
        const viewer = await auth.getUser();
        const targetId = paramId === "me" ? viewer._id : paramId;
        setViewerId(viewer._id);
        const response = await getFollowedById(targetId, viewer._id);
        if (response.success !== false) {
          setFolloweds(response.data);
        }
      } catch (error) {
        console.error("Error fetching follower data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedsData();
  }, [auth, paramId, navigate]);

  // Handle follow/unfollow updates
  const onFollowChange = (targetId, isFollow) => {
    setFolloweds((prev) => {
      return prev.map((user) => {
        if (user._id === targetId) {
          return { ...user, isFollowing: isFollow };
        }
        return user;
      });
    });
  };

  if (!auth.loggedIn) return <Unauthorised />;

  if (loading)
    return (
      <div className="p-16 text-center">
        <Spinner aria-label="Loading following data" size="xl" />
      </div>
    );

  return (
    <div className="flex justify-center">
      <Card className="mt-16 w-2/5 text-gray-900 dark:text-white">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none">Following</h5>
        </div>
        <div className="flow-root">
          {followeds.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {followeds.map((followed) => (
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
                      onFollowChange={onFollowChange}
                      isFollowing={followed.isFollowing}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Not following anyone yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Following;
