import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authService";

const ResetPassword = ({ token }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect immediately if no token is found
      return;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword != confirmedPassword) {
      setAlert("Passwords do not match");
      return;
    }

    const submittedUser = {
      token,
      password: newPassword,
    };

    const response = await resetPassword(submittedUser); // Await the API call

    if (response.success !== false) {
      setAlert("Password has been successfully changed.");
    } else {
      console.error(response);
      setAlert(
        "Password update failed! " + (response.error || "Unknown error")
      );
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
        <label>New Password:</label>
        <input
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm New Password:</label>
        <input
          type="password"
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
      </div>
      <div
        style={{
          background: "red",
          color: "white",
          padding: "0.5em",
          width: "100%",
          margin: "1em",
          minHeight: "2em",
          borderRadius: "5px",
          visibility: alert ? "visible" : "hidden", // Keeps space reserved
        }}>
        {alert}
      </div>
      <button style={{ width: "96px", marginTop: "1em" }}>Register</button>
    </form>
  );
};
ResetPassword.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ResetPassword;
