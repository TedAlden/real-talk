import { useState } from "react";
import { registerUser } from "../api/userService";

function RegisterWindow() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username,
      password,
      email,
    };
    const response = await registerUser(submittedUser);

    if (response.success !== false) {
      setAlert("Registration successful!");
    } else {
      console.log(response);
      setAlert("Registration failed! " + response.error);
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
      {alert && (
        <div
          style={{
            background: "red",
            color: "white",
            padding: "0.5em",
            width: "100%",
            margin: "1em",
            borderRadius: "5px",
          }}
        >
          {alert}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "0.75em",
        }}
      >
        <label>Email:</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} />

        <label>Username:</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />

        <label>Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button style={{ width: "96px", marginTop: "1em" }}>Register</button>
    </form>
  );
}

export default RegisterWindow;
