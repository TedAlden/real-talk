import { useState, useEffect, useCallback } from "react";
import {
  getFollowStatsById,
  checkIsFollowing,
} from "../api/followersService.js";
import { Link, useParams } from "react-router-dom";
import { decode } from "html-entities";
import _ from "lodash";
import { getPostByQuery } from "../api/postService.js";
import { getUserById } from "../api/userService.js";
import useAuth from "../hooks/useAuth.js";
import Post from "../components/Post.jsx";
import Composer from "../components/Composer.jsx";
import { Spinner } from "flowbite-react";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";
import { useCacheUpdater } from "../hooks/useUserCache";
import { getSafeObject } from "../util/defaultObjects.js";
import SuggestedUsers from "../components/SuggestedUsers.jsx";

function UserProfile() {
  const auth = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState({
    followingUser: 0,
    followedByUser: 0,
  });
  const [viewer, setViewer] = useState(null);
  const [posts, setPosts] = useState(false);
  const paramId = useParams().id;

  const updateCache = useCacheUpdater();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getUser();

      setViewer(getSafeObject(user, "user"));
    };
    fetchUser();
  }, [auth]);

  useEffect(() => {
    if (viewer) {
      const userId = paramId === "me" ? viewer._id : paramId;
      updateCache([userId]);
    }
  }, [viewer, updateCache, paramId]);

  const fetchUserData = useCallback(async () => {
    if (!viewer) return;
    setLoading(true);
    try {
      const profileUserId = paramId === "me" ? viewer._id : paramId;
      if (!profileUserId) return;
      if (profileUserId === viewer._id) {
        setUserData(viewer);
        setIsFollowing(false);
      } else {
        const userRes = await getUserById(profileUserId);
        if (userRes.success !== false) setUserData(userRes.data);

        const followRes = await checkIsFollowing(viewer._id, profileUserId);
        if (followRes.success !== false) setIsFollowing(followRes.data);
      }

      const postsRes = await getPostByQuery("userId", profileUserId);
      if (postsRes.success !== false) setPosts(postsRes.data);

      const statsRes = await getFollowStatsById(profileUserId);
      if (statsRes.success !== false) setFollowStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [viewer, paramId]);

  const isUserFound = userData && userData._id;

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onFollowChange = async (targetId, isFollow) => {
    setIsFollowing(isFollow);
    try {
      const response = await getFollowStatsById(userData._id);
      if (response.success !== false) {
        setFollowStats(response.data);
      }
    } catch (error) {
      console.error("Error updating follow stats:", error);
    }
  };

  const onPostDeleted = async (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const cardStyle =
    "p-4 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800";

  if (loading) return <Spinner className="p-16 text-center" size="xl" />;

  return isUserFound ? (
    <div className="m-4 grid w-full grid-cols-7 gap-6">
      <div className="col-span-2" />
      <div className="col-span-3 text-lg text-gray-900 dark:text-white">
        <div
          className={`grid grid-cols-4 items-center justify-center ${cardStyle}`}
        >
          <div className="col-span-4 flex items-start sm:col-span-1">
            <img
              className="h-auto w-28 rounded-full object-cover"
              src={userData?.profile_picture}
              data-testid="main-profile-picture"
              alt="Profile"
            />
          </div>
          <div className="col-span-4 ml-2 flex flex-col justify-start gap-2 sm:col-span-3">
            <div>
              <p
                data-testid="profile-full-name"
                className="text-xl font-semibold"
              >
                {userData.first_name} {userData.last_name}
              </p>
              <p data-testid="profile-username" className="text-base">
                @{userData.username}
              </p>
            </div>

            <p
              data-testid="profile-bio"
              className="text-base text-gray-700 dark:text-gray-300"
            >
              {decode(userData.biography) || "No bio available"}
            </p>
            <ul className="flex text-sm">
              <li className="me-2">
                <Link
                  to={`/user/${userData._id}/following`}
                  className="hover:underline"
                >
                  <span
                    data-testid="profile-followed-count"
                    className="font-semibold text-gray-900 dark:text-white"
                  >
                    {followStats.followedByUser.toLocaleString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    Following
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/user/${userData._id}/followers`}
                  className="hover:underline"
                >
                  <span
                    data-testid="profile-following-count"
                    className="font-semibold text-gray-900 dark:text-white"
                  >
                    {followStats.followingUser.toLocaleString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    Followers
                  </span>
                </Link>
              </li>
            </ul>
            <UserInteractionButtons
              viewerId={viewer._id}
              targetId={userData._id}
              onFollowChange={onFollowChange}
              isFollowing={isFollowing}
            />
          </div>
        </div>

        <div className="">
          <div className="my-3 rounded-md bg-white p-2 text-center shadow dark:border dark:border-gray-700 dark:bg-gray-800">
            Posts Today: 0/1
          </div>

          {viewer._id == userData._id && (
            <div className={`mb-3 p-2 ${cardStyle}`}>
              <Composer
                data-testid="profile-post-composer"
                onSubmit={fetchUserData}
                mode="createPost"
              />
            </div>
          )}

          {posts?.map((post) => (
            <Post
              key={post._id}
              post={post}
              viewer={viewer}
              onDelete={onPostDeleted}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <SuggestedUsers />
      </div>
    </div>
  ) : (
    <div>
      <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
        User not found!
      </h1>
      <p className="my-5 text-gray-900 dark:text-white">
        The link may be invalid or the account may have been deleted.
      </p>
    </div>
  );
}

export default UserProfile;
