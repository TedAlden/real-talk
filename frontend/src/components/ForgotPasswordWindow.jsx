import { useState } from "react";
import { sendResetEmail } from "../api/authService";

function ForgotPasswordWindow() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      email,
    };
    const response = await sendResetEmail(submittedUser);

    if (response.success !== false) {
      setAlert("Password reset email sent!");
    } else {
      console.log(response);
      setAlert("Password reset failed! " + response.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p>
        Enter your email to receive a password <br></br>reset link.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "0.75em",
          textAlign: "right",
        }}
      >
        <label>Email:</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <a
        style={{
          margin: "0.5em",
        }}
        href="/login"
      >
        <small>Back to Login </small>
      </a>
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
        }}
      >
        {alert}
      </div>
      <button style={{ width: "96px", marginTop: "1em" }}>Send</button>
    </form>
  );
}

export default ForgotPasswordWindow;
