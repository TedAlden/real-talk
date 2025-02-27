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

function UserProfileDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyUser);
  const [alert, setAlert] = useState("");
  const [userId, setUserId] = useState(Cookies.get("authUser"));

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
    };

    loadUserData();
  }, [navigate, userId]);

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
    const submittedUser = { ...formData, _id: userId };
    const response = await updateUser(submittedUser);

    if (response.success !== false) {
      setAlert("User updated successfully!");
    } else {
      console.log(response);
      setAlert("User update failed! " + response.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "0.75em",
          textAlign: "right",
        }}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData?.username}
          onChange={handleChange}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData?.password}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={formData?.email}
          onChange={handleChange}
        />

        <label>First Name:</label>
        <input
          type="text"
          name="name.first"
          value={formData?.name?.first}
          onChange={handleChange}
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="name.last"
          value={formData?.name?.last}
          onChange={handleChange}
        />

        <label>Birthday:</label>
        <input
          type="date"
          name="birthday"
          value={formData?.birthday}
          onChange={handleChange}
        />

        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData?.phone}
          onChange={handleChange}
        />

        <label>Country:</label>
        <input
          type="text"
          name="location.country"
          value={formData?.location?.country}
          onChange={handleChange}
        />

        <label>State:</label>
        <input
          type="text"
          name="location.state"
          value={formData?.location?.state}
          onChange={handleChange}
        />

        <label>City:</label>
        <input
          type="text"
          name="location.city"
          value={formData?.location?.city}
          onChange={handleChange}
        />

        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData?.bio}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div
        style={{
          background: alert.includes("failed") ? "red" : "green",
          color: "white",
          padding: "0.5em",
          width: "100%",
          margin: "1em",
          minHeight: "2em",
          borderRadius: "5px",
          visibility: alert ? "visible" : "hidden",
        }}>
        {alert}
      </div>
      <button style={{ width: "96px", marginTop: "1em" }}>
        Update Profile
      </button>
    </form>
  );
}

export default UserProfileDetails;
