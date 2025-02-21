import { useState } from "react";
import { loginUser } from "../api/userService";

function LoginWindow() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username,
      password,
    };
    const response = await loginUser(submittedUser);

    if (response.success !== false) {
      setAlert("Login successful!");
    } else {
      console.log(response);
      setAlert("Login failed! " + response.error);
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "0.75em",
          textAlign: "right",
        }}
      >
        <label>Username:</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />

        <label>Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
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
        }}
      >
        {alert}
      </div>

      <button style={{ width: "96px", marginTop: "1em" }}>Login</button>
    </form>
  );
}

export default LoginWindow;
