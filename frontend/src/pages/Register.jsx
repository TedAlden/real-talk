import viteLogo from "/vite.svg";
import { useEffect, useState } from "react";
import { registerUser } from "../api/authService";
import Cookies from "js-cookie";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (Cookies.get("authToken")) {
      const token = JSON.parse(Cookies.get("authToken"));
      if (token && token.type === "authenticated") {
        setLoggedIn(true);
      }
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(username, email, password);

    if (response.success !== false) {
      setAlertMessage("Registration successful!");
    } else {
      console.log(response);
      setAlertMessage("Registration failed! " + response.error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    Cookies.remove("authToken");
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      {loggedIn ? (
        <form onSubmit={handleLogout}>
          <p>You are logged in</p>
          <button style={{ width: "96px" }}>Logout</button>
        </form>
      ) : (
        <form
          onSubmit={handleRegister}
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
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Email:</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
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
              visibility: alertMessage ? "visible" : "hidden",
            }}
          >
            {alertMessage}
          </div>
          <button style={{ width: "96px", marginTop: "1em" }}>Register</button>
        </form>
      )}
    </>
  );
}

export default Register;
