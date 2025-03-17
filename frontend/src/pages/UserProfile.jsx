import { useState, useEffect } from "react";
import {
  getFollowStatsById,
  checkIsFollowing,
  followUser,
  unfollowUser,
} from "../api/followersService.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { decode } from "html-entities";
import _ from "lodash";

import { getUserById } from "../api/userService.js";
import useAuth from "../hooks/useAuth.js";

import { Spinner } from "flowbite-react";

const emptyUser = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  telephone: "",
  biography: "",
  profile_picture: "",
  address: {
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
  },
  mfa: {
    enabled: false,
    secret: "",
  },
  is_verified: false,
  is_admin: false,
};

const dummyPosts = [
  {
    date: "24th Oct 2034",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    date: "10th Jan 2009",
    content:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    date: "5th Apr 1623",
    content:
      "Parturient facilisis amet laoreet curae aliquam. Sit rutrum maximus posuere netus; purus fermentum feugiat quis. Parturient pretium ligula non felis cubilia cubilia. Quam habitant et nisl risus sit. Ultrices fringilla primis porttitor nulla placerat ultricies ornare. Quam amet ullamcorper velit nisi aliquet. Suscipit justo quisque euismod vestibulum pharetra eros. Finibus proin eu proin natoque ultrices ultrices.",
  },
];

function UserProfile() {
  const navigate = useNavigate();
  const auth = useAuth();
  const auth = useAuth();
  const [userData, setUserData] = useState(emptyUser);
  const [userFound, setUserFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState({
    followingUser: 0,
    followedByUser: 0,
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const paramId = useParams().id;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        setLoading(true);
        const user = await auth.getUser();
        const profileUserId = paramId === "me" ? user._id : paramId;

        if (profileUserId === user._id) {
          setIsCurrentUser(true);
        }

        const responses = await Promise.all([
          getUserById(profileUserId),
          getFollowStatsById(profileUserId),
          checkIsFollowing(user._id, profileUserId),
        ]);

        const setters = [setUserData, setFollowStats, setIsFollowing];

        responses.forEach((response, idx) => {
          if (response.success !== false) {
            setters[idx](response.data);
            idx === 0 && setUserFound(true);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [paramId, navigate]);

  const handleFollow = async () => {
    try {
      const user = await auth.getUser();
      const profileUserId = paramId === "me" ? user._id : paramId;
      const followed = profileUserId;
      const followAction = isFollowing ? unfollowUser : followUser;
      const prev = isFollowing;
      setIsFollowing(!isFollowing);
      console.log("Follow action:", followAction);
      console.log("Follower:", user._id);
      console.log("Followed:", followed);

      const followResponse = await followAction(user._id, followed);
      if (followResponse.success == false) {
        setIsFollowing(prev);
      }
      const statsUpdated = await getFollowStatsById(profileUserId);
      if (statsUpdated.success !== false) {
        setFollowStats(statsUpdated.data);
      }
    } catch (error) {
      console.error("Error updating follow stats:", error);
    }
  };

  const handleReport = () => {
    // Not implemented yet
  };

  return loading ? (
    <div className="p-16 text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  ) : userFound ? (
    <div className="flex flex-col items-center justify-center">
      <div className="md:max-w-4xl">
        <div className="m-4 grid grid-cols-4 gap-6 p-4 text-lg text-gray-900 dark:text-white">
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
            {!isCurrentUser && (
              <div className="flex gap-2">
                <button
                  onClick={handleFollow}
                  className={`w-full rounded-md px-4 py-1 text-sm font-medium transition sm:w-min ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
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
          <div className="col-span-4 rounded-md bg-white p-2 text-center shadow dark:border dark:border-gray-700 dark:bg-gray-800">
            <p>Posts Today: 0/1</p>
          </div>
          {dummyPosts.map((post, index) => (
            <div
              key={index}
              className="col-span-4 rounded-md bg-white p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Posted on {post.date}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                {post.content}
              </p>
            </div>
          ))}
        </div>
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
