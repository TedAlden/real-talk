import { useState, useEffect } from "react";
import { getUserById } from "../api/userService.js";
import { useNavigate, useParams } from "react-router-dom";
import AppCard from "../components/AppCard";
import _ from "lodash";
import Cookies from "js-cookie";
const emptyUser = {
  _id: "",
  username: "",
  password: "",
  email: "",
  name: {
    first: "",
    last: "",
  },
  location: {
    city: "",
    state: "",
    country: "",
  },
  birthday: "",
  phone: "",
  bio: "",
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
  const [profilePic, setProfilePic] = useState();
  const paramId = useParams().id

  useEffect(() => {
    const user = Cookies.get("authUser");
    const userId = paramId ==0 ? user :  paramId; //if id is 0 uses authUser id
    console.log("Profile userId:",userId);
    const loadUserData = async () => {
      const response = await getUserById(userId);
      if (response.success !== false) {
        setUserData(response.data);
      }
      if (response.data.picture) {
        setProfilePic(response.data.picture);
      }
    };

    loadUserData();
  }, [paramId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="md:max-w-4xl">
    <AppCard >
      
  <div className="grid grid-cols-4 gap-6 text-lg text-gray-900 dark:text-white m-4 p-4">
  <h1 className="col-span-4 text-2xl font-semibold mb-2 text-center w-full">Profile</h1>
  <div className="flex items-center justify-center">
            <img
              className="rounded-full  w-full shadow-lg h-auto"
              src={profilePic}
              alt="Profile"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                objectFit: "cover",
              }}
            />
 </div>
          <div className="col-span-3 flex flex-col justify-start  mt-2">
            <p className="text-xl font-semibold">{userData.username}</p>
            <p className="text-gray-700 dark:text-gray-300">{userData.bio || "No bio available"}</p>
          </div>
          <div className="col-span-4 text-center text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 py-2 rounded-md shadow">
            <p className="font-semibold">Posts Today: 0/1</p>
          </div>
          {dummyPosts.map((post, index) => (
            <div
              key={index}
              className="col-span-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Posted on {post.date}
              </p>
              <p className="mt-2 text-gray-900 dark:text-gray-100 leading-relaxed">
                {post.content}
              </p>
            </div>
          ))}
  </div>
  </AppCard>
  </div>  
  </div>
  ) 
}

export default UserProfile;
