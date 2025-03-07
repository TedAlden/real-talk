import { useState, useEffect } from "react";
import { updateUser, getUserById } from "../api/userService.js";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import _ from "lodash";

import { HiAtSymbol, HiInformationCircle, HiMail } from "react-icons/hi";
import {
  Alert,
  Button,
  Datepicker,
  FileInput,
  TextInput,
  Textarea,
  Label,
  ToggleSwitch,
} from "flowbite-react";

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

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(emptyUser);
  const [profilePic, setProfilePic] = useState();

  const userId = useParams().id;
  console.log("userId:",userId);
  useEffect(() => {
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
  }, [navigate]);

  return (
  <div className="grid grid-cols-4 gap-4">
    <div ><img
                  className="h-32 w-32 overflow-hidden rounded-full"
                  src={profilePic}
                  alt="Profile"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                /></div>
    <div className="col-span-3">
      <p>{userData.username}</p>
      <p>{userData.bio}</p>
    </div>
    
  </div>
  ) 
}

export default UserProfile;
