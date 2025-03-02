import viteLogo from "/vite.svg";
import { useState, useEffect } from "react";
import { updateUser, getUserById } from "../api/userService.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import _ from "lodash";

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
  const [formData, setFormData] = useState(emptyUser);
  const [alert, setAlert] = useState("");
  const [userId, setUserId] = useState(Cookies.get("authUser"));
  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    const user = Cookies.get("authUser");
    if (!user) {
      navigate("/"); // Redirect immediately if no token is found
      return;
    }
    setUserId(user);
    const loadUserData = async () => {
      const response = await getUserById(userId);
      if (response.success !== false) {
        setFormData(response.data);
      }
      if (response.data.picture) {
        setProfilePic(response.data.picture);
      }
    };

    loadUserData();
  }, [navigate, userId]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileRead = async (e) => {
    const { files } = e.target;
    const file = files[0];
    const base64 = await convertBase64(file);
    base64 && setProfilePic(base64);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      if (value) {
        _.set(updated, name, value);
      } else {
        _.unset(updated, name);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = { ...formData, _id: userId, picture: profilePic };
    const response = await updateUser(submittedUser);
    console.log(submittedUser);
    if (response.success !== false) {
      setAlert("User updated successfully!");
    } else {
      console.log(response);
      setAlert("User update failed! " + response.error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "0.5rem",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "end",
        }}>
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          {profilePic && (
            <img
              src={profilePic}
              alt="Profile"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                objectFit: "cover",
              }}
            />
          )}
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            name="originalFileName"
            onChange={handleFileRead}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <label>User2name</label>
        <input
          type="text"
          name="username"
          value={formData?.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData?.password}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleChange}
        />
        <label>First Name</label>
        <input
          type="text"
          name="name.first"
          value={formData?.name?.first}
          onChange={handleChange}
        />
        <label>Last Name</label>
        <input
          type="text"
          name="name.last"
          value={formData?.name?.last}
          onChange={handleChange}
        />
        <label>Birthday</label>
        <input
          type="date"
          name="birthday"
          value={formData?.birthday}
          onChange={handleChange}
        />
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData?.phone}
          onChange={handleChange}
        />
        <label>Country</label>
        <input
          type="text"
          name="location.country"
          value={formData?.location?.country}
          onChange={handleChange}
        />
        <label>State</label>
        <input
          type="text"
          name="location.state"
          value={formData?.location?.state}
          onChange={handleChange}
        />
        <label>City</label>
        <input
          type="text"
          name="location.city"
          value={formData?.location?.city}
          onChange={handleChange}
        />
        <label>Bio</label>
        <textarea
          name="bio"
          value={formData?.bio}
          onChange={handleChange}
          rows="3"
        />{" "}
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "0.5em",
            backgroundColor: alert.includes("failed") ? "red" : "green",
            color: "white",
            borderRadius: "5px",
          }}>
          {alert}
        </div>
        <button
          type="submit"
          style={{
            gridColumn: "1 / -1",
            justifySelf: "center",
          }}>
          Update Profile
        </button>
      </form>
    </>
  );
}

export default UserProfile;
