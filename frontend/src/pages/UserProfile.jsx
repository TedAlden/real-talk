import { useState, useEffect } from "react";
import { getUserById } from "../api/userService.js";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import Cookies from "js-cookie";
import { decode } from "html-entities";

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
  const [userData, setUserData] = useState(emptyUser);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const paramId = useParams().id;

  useEffect(() => {
    const user = Cookies.get("authUser");
    const userId = paramId == 0 ? user : paramId; //if id is 0 uses authUser id
    console.log("Profile userId:", userId);
    if (userId === user) {
      setIsCurrentUser(true);
    }
    const loadUserData = async () => {
      const response = await getUserById(userId);
      if (response.success !== false) {
        setUserData(response.data);
      }
    };

    loadUserData();
  }, [paramId, navigate]);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    // Add API stuff here
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="md:max-w-4xl">
        <div className="rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 md:mt-0 xl:p-0">
          <div className="m-4 grid grid-cols-4 gap-6 p-4 text-lg text-gray-900 dark:text-white">
            <div className="col-span-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Profile</h1>
              {!isCurrentUser && (
                <button
                  onClick={handleFollow}
                  className={`rounded-md px-4 py-1 text-sm font-medium transition ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
            <div className="flex items-center justify-center">
              <img
                className="h-32 w-32 rounded-full object-cover shadow-lg"
                src={userData?.profile_picture}
                alt="Profile"
              />
            </div>
            <div className="col-span-3 mt-2 flex flex-col justify-start">
              <p className="text-xl font-semibold">{userData.username}</p>
              <p className="text-gray-700 dark:text-gray-300">
                {decode(userData.biography) || "No bio available"}
              </p>
            </div>
            <div className="col-span-4 rounded-md bg-gray-100 py-2 text-center text-gray-800 shadow dark:bg-gray-700 dark:text-gray-300">
              <p className="font-semibold">Posts Today: 0/1</p>
            </div>
            {dummyPosts.map((post, index) => (
              <div
                key={index}
                className="col-span-4 rounded-md bg-gray-100 p-4 shadow-md dark:bg-gray-700"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Posted on {post.date}
                </p>
                <p className="mt-2 leading-relaxed text-gray-900 dark:text-gray-100">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
