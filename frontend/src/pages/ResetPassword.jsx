import viteLogo from "/vite.svg";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authService";

function ResetPassword() {
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

    const response = await resetPassword(token, newPassword);

    if (response.success !== false) {
      setAlert("Password has been successfully changed.");
    } else {
      console.error(response);
      setAlert(
        "Password update failed! " + (response.error || "Unknown error")
      );
    }
  };

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "0.75em",
            textAlign: "right",
          }}
        >
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
            visibility: alert ? "visible" : "hidden",
          }}
        >
          {alert}
        </div>
        <button style={{ width: "96px", marginTop: "1em" }}>Register</button>
      </form>
    </>
  );
}

export default ResetPassword;
