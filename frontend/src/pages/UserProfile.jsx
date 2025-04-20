import { useState, useEffect, useCallback } from "react";
import {
  getFollowStatsById,
  checkIsFollowing,
} from "../api/followersService.js";
import { Link, useParams } from "react-router-dom";
import { decode } from "html-entities";
import _ from "lodash";
import { getPostByQuery } from "../api/postService.js";
import { getUserById, getUsersByQuery } from "../api/userService.js";
import useAuth from "../hooks/useAuth.js";
import Post from "../components/Post.jsx";
import PostCreator from "../components/PostCreator.jsx";
import { Spinner } from "flowbite-react";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";

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
  const [userCache, setUserCache] = useState({});
  const paramId = useParams().id;

  useEffect(() => {
    auth.getUser().then(setViewer);
  }, [auth]);

  const updateUserCache = useCallback(async (userIds) => {
    const newIds = Array.from(new Set(userIds));
    if (newIds.length === 0) return;
    try {
      const response = await getUsersByQuery("id", newIds);

      if (response.success !== false) {
        setUserCache((prev) => {
          const next = { ...prev };
          response.data.forEach((user) => {
            if (!next[user._id]) next[user._id] = user;
          });
          return next;
        });
      }
    } catch (err) {
      console.error("Error updating user cache:", err);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!viewer) return;
    setLoading(true);
    try {
      const profileUserId = paramId === "me" ? viewer._id : paramId;

      if (profileUserId === viewer._id) {
        setUserData(viewer);
        setUserCache((prev) => ({
          ...prev,
          [viewer._id]: viewer,
        }));
        setIsFollowing(false);
      } else {
        const userRes = await getUserById(profileUserId);
        if (userRes.success !== false) {
          setUserData(userRes.data);
          if (!userCache[userRes.data._id]) {
            setUserCache((prev) => ({
              ...prev,
              [userRes.data._id]: userRes.data,
            }));
          }
        }

        const followRes = await checkIsFollowing(viewer._id, profileUserId);
        if (followRes.success !== false) setIsFollowing(followRes.data);
      }

      const postsRes = await getPostByQuery("user_id", profileUserId);
      if (postsRes.success !== false) {
        setPosts(postsRes.data);
        const allIds = postsRes.data.map((p) => p.user_id);

        const userIds = Array.from(new Set(allIds)).filter(
          (id) => !userCache[id],
        );

        if (userIds.length > 0) updateUserCache(userIds);
      }

      const statsRes = await getFollowStatsById(profileUserId);
      if (statsRes.success !== false) setFollowStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [viewer, paramId, updateUserCache]);

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

  if (loading) return <Spinner className="p-16 text-center" size="xl" />;

  return isUserFound ? (
    <div className="m-4 mx-auto grid max-w-xl gap-6 p-4 text-lg text-gray-900 dark:text-white">
      <div className="col-span-4 flex items-center justify-center sm:col-span-1">
        <img
          className="h-auto w-32 rounded-full object-cover shadow-lg"
          src={userData?.profile_picture}
          alt="Profile"
        />
      </div>
      <div className="col-span-4 flex flex-col justify-start gap-2 sm:col-span-3">
        <p className="text-xl font-semibold">
          {userData.first_name} {userData.last_name}
        </p>
        <p className="text-base">@{userData.username}</p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          {decode(userData.biography) || "No bio available"}
        </p>
        <ul className="flex text-sm">
          <li className="me-2">
            <Link
              to={`/user/${userData._id}/following`}
              className="hover:underline"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
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
              <span className="font-semibold text-gray-900 dark:text-white">
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
      <div className="col-span-4">
        <div className="mb-2 rounded-md p-2 text-center shadow dark:border dark:border-gray-700 dark:bg-gray-800">
          Posts Today: 0/1
        </div>

        {viewer._id == userData._id && <PostCreator onSubmit={fetchUserData} />}

        {posts?.map((post) => (
          <Post
            key={post._id}
            post={post}
            viewer={viewer}
            updateUserCache={updateUserCache}
            userCache={userCache}
            onDelete={onPostDeleted}
          />
        ))}
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
