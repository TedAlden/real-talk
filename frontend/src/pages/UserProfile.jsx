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
import { Spinner, Card } from "flowbite-react";
import UserInteractionButtons from "../components/UserInteractionButtons.jsx";
import { getSafeObject } from "../util/defaultObjects.js";
import DailyPostCounter from "../components/DailyPostCounter";
import SuggestedUsers from "../components/SuggestedUsers.jsx";
import Composer from "../components/Composer.jsx";
import DropdownMenu from "../components/DropdownMenu.jsx";
import { useNavigate } from "react-router-dom";
import ReportWindow from "../components/ReportWindow.jsx";
import Unauthorised from "../components/Unauthorised.jsx";
import { banTarget } from "../api/adminService.js";

function UserProfile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState({
    followingUser: 0,
    followedByUser: 0,
  });
  const [viewer, setViewer] = useState(null);
  const [posts, setPosts] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const paramId = useParams().id;

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getUser();

      setViewer(getSafeObject(user, "user"));
    };
    fetchUser();
  }, [auth]);

  const fetchUserData = useCallback(async () => {
    if (!viewer || !viewer._id) return;
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

  const cardStyle =
    "p-4 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800";

  // Filter posts to get only today's posts
  const getTodayPosts = () => {
    if (!Array.isArray(posts)) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    return posts.filter((post) => {
      const postDate = new Date(post.created_at);
      postDate.setHours(0, 0, 0, 0); // Set to start of day

      // Compare the dates (ignoring time)
      return postDate.getTime() === today.getTime();
    }).length;
  };

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
      <div className="container mx-auto">
        <div className="mx-4 mt-4 grid w-full grid-cols-7 gap-6">
          <div className="col-span-2" />
          <div className="col-span-3 text-lg text-gray-900 dark:text-white">
            <div
              className={`mb-4 grid grid-cols-4 items-center justify-center ${cardStyle}`}
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
                  {" "}
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
                    <Link
                      to={`/network?tab=following`}
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
                      to={`/network?tab=followers`}
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
                  mode="follow"
                />
              </div>
            </div>

            <div className="mb-4 rounded-md bg-white p-2 text-center shadow dark:border dark:border-gray-700 dark:bg-gray-800">
              <DailyPostCounter posts={getTodayPosts()} />
            </div>

            {viewer._id == userData._id && getTodayPosts() < 1 && (
              <div
                data-testid="profile-post-composer"
                className={`mb-4 p-2 ${cardStyle}`}
              >
                <Composer onSubmit={fetchUserData} mode="createPost" />
              </div>
            )}

            {viewer._id == userData._id && getTodayPosts() >= 1 && (
              <div
                className={`mb-4 p-2 ${cardStyle} text-center text-red-500 dark:text-red-400`}
              >
                You've reached your daily post limit. Try again tomorrow.
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
          <div className="col-span-2">
            <SuggestedUsers viewer={viewer} />
          </div>
        </div>
      </div>{" "}
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
