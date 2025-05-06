import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { decode } from "html-entities";
import { Spinner } from "flowbite-react";

import useScrollingFeed from "../hooks/useScrollingFeed.js";
import useAuth from "../hooks/useAuth.js";

import UserInteractionButtons from "../components/UserInteractionButtons.jsx";
import DailyPostCounter from "../components/DailyPostCounter";
import DropdownMenu from "../components/DropdownMenu.jsx";
import ReportWindow from "../components/ReportWindow.jsx";
import Unauthorised from "../components/Unauthorised.jsx";
import Composer from "../components/Composer.jsx";
import Post from "../components/Post.jsx";
import FeedLayout from "../layouts/FeedLayout.jsx";

import { getSafeObject } from "../util/defaultObjects.js";

import { getPostByQuery } from "../api/postService.js";
import { getUserById } from "../api/userService.js";
import { banTarget } from "../api/adminService.js";
import {
  getFollowStatsById,
  checkIsFollowing,
} from "../api/followersService.js";

const style = {
  card: "p-4 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800",
};

/**
 * User profile page displaying user info and posts
 * Handles user interactions, post management and profile stats
 */
function UserProfile() {
  // Navigation and auth setup
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  // Profile state management
  const [viewer, setViewer] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState({
    followingUser: 0,
    followedByUser: 0,
  });

  // Get profile ID from URL params
  const profileId = params.id; // User ID, i.e. realtalk.com/profile/:profileId

  // Initialize infinite scrolling feed
  const { posts, feedLoading, hasMore, onPostDeleted, onPostCreated } =
    useScrollingFeed({
      viewer: viewer,
      postsPerPage: 5,
      fetchFeedFunction: async ({ limit, offset }) => {
        const profileUserId = profileId === "me" ? viewer._id : profileId;
        return await getPostByQuery("userId", profileUserId, { limit, offset });
      },
    });

  // Filter posts for daily limit
  const dailyPosts = posts.filter((post) => {
    const postDate = new Date(post.created_at);
    const today = new Date();
    return (
      postDate.getDate() === today.getDate() &&
      postDate.getMonth() === today.getMonth() &&
      postDate.getFullYear() === today.getFullYear()
    );
  });

  /**
   * Fetch all user data.
   */
  const fetchUserData = useCallback(async () => {
    if (!viewer || !viewer._id) return;
    setLoading(true);
    try {
      const profileUserId = profileId === "me" ? viewer._id : profileId;
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

      const statsRes = await getFollowStatsById(profileUserId);
      if (statsRes.success !== false) setFollowStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [viewer, profileId]);

  const handleSubmit = (post) => {
    onPostCreated(post);
    fetchUserData();
  };

  /**
   * Handle following toggle.
   */
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

  /**
   * Handle banning the user. Can only be done by admins.
   */
  const handleBanUser = async () => {
    try {
      if (!viewer?.is_admin) return;
      const response = await banTarget({
        targetType: "user",
        targetId: userData._id,
        is_banned: !userData.is_banned,
      });

      if (response.success !== false) {
        setUserData((prev) => ({
          ...prev,
          is_banned: !prev.is_banned,
        }));
      }
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const isUserFound = userData && userData._id;

  const userOptions =
    viewer?._id !== userData?._id
      ? [
          {
            label: "Report user",
            action: () => {
              setIsReporting(true);
            },
          },
          ...(viewer?.is_admin
            ? [
                {
                  label: "Ban user",
                  action: handleBanUser,
                },
              ]
            : []),
        ]
      : [
          {
            label: "Edit profile",
            action: () => {
              navigate("/settings");
            },
          },
        ];

  /**
   * Determine which user is viewing this profile page.
   */
  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getUser();
      setViewer(getSafeObject(user, "user"));
    };
    fetchUser();
  }, [auth]);

  /**
   * Fetch the user data to display on the profile page.
   */
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!auth.loggedIn) return <Unauthorised />;

  if (loading)
    return (
      <div className="p-16 text-center">
        <Spinner aria-label="Profile loading spinner" size="xl" />
      </div>
    );

  if (userData?.is_banned)
    return (
      <div className="grid w-full grid-cols-5">
        <div className="col-span-2" />
        <div className="col-span-1 mb-4 flex w-full items-center justify-between rounded-md bg-white p-4 text-lg text-gray-900 shadow dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
          <p>User has been banned.</p>
          {viewer?.is_admin && (
            <button
              className="rounded-md p-1 text-blue-600 hover:text-blue-400 dark:text-blue-500 dark:hover:text-blue-600"
              onClick={handleBanUser}
            >
              Undo
            </button>
          )}
        </div>
      </div>
    );

  if (!isUserFound) {
    return (
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

  return (
    <>
      <FeedLayout viewer={viewer}>
        <div
          className={`mb-4 grid grid-cols-4 items-center justify-center ${style.card}`}
        >
          <div className="col-span-4 mb-4 flex justify-center sm:col-span-1 sm:mb-0 sm:items-start">
            <img
              className="h-auto w-28 rounded-full object-cover"
              src={userData?.profile_picture}
              data-testid="main-profile-picture"
              alt="Profile"
            />
          </div>
          <div className="col-span-4 ml-2 flex flex-col justify-start gap-2 sm:col-span-3">
            <div>
              <div className="flex items-center justify-between">
                <p
                  data-testid="profile-full-name"
                  className="text-xl font-semibold"
                >
                  {userData.first_name} {userData.last_name}
                </p>{" "}
                <DropdownMenu
                  items={userOptions}
                  className="ml-auto"
                  data-testid="profile-dropdown-menu"
                />
              </div>
              <p
                data-testid="profile-username"
                className="text-md text-gray-700 dark:text-gray-300"
              >
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
                <Link to={`/network?tab=following`} className="hover:underline">
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
                <Link to={`/network?tab=followers`} className="hover:underline">
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
              mode="follow"
            />
          </div>
        </div>

        <div className="mb-4 rounded-md bg-white p-2 text-center shadow dark:border dark:border-gray-700 dark:bg-gray-800">
          <DailyPostCounter posts={dailyPosts.length} />
        </div>

        {viewer._id == userData._id && dailyPosts.length < 1 && (
          <div
            data-testid="profile-post-composer"
            className={`mb-4 p-2 ${style.card}`}
          >
            <Composer onSubmit={handleSubmit} mode="createPost" />
          </div>
        )}

        {viewer._id == userData._id && dailyPosts.length >= 1 && (
          <div
            className={`mb-4 p-2 ${style.card} text-center text-red-500 dark:text-red-400`}
          >
            You've reached your daily post limit. Try again tomorrow.
          </div>
        )}

        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            viewer={viewer}
            onDelete={onPostDeleted}
          />
        ))}

        {feedLoading && (
          <div className="p-4 text-center">
            <Spinner aria-label="Loading more posts" size="lg" />
          </div>
        )}

        {!hasMore && !feedLoading && (
          <div className="p-4 text-center text-gray-500">
            No more posts to load.
          </div>
        )}
      </FeedLayout>

      <ReportWindow
        visible={isReporting}
        targetType="user"
        target={userData?._id}
        onClose={() => {
          setIsReporting(false);
        }}
        reporter={viewer}
      />
    </>
  );
}

export default UserProfile;
