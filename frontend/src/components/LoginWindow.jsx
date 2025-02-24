import { useState } from "react";
import { loginUser } from "../api/authService";
import Cookies from "js-cookie";

function LoginWindow() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [token, setToken] = useState(Cookies.get("authToken"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username,
      password,
    };
    const response = await loginUser(submittedUser);

    if (response.success !== false) {
      setAlert("");
      Cookies.set("authToken", response.data.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      setToken(response.data.token);
    } else {
      console.log(response);
      setAlert("Login failed! " + response.error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setToken(null);
  };

  return (
    <>
      {token ? (
        <form onSubmit={handleLogout}>
          <p>You are logged in</p>
          <button style={{ width: "96px" }}>Logout</button>
        </form>
      ) : (
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
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            style={{
              textAlign: "right",

              width: "100%",
            }}
          >
            <a href="/forgot-password">
              <small>Forgot Password</small>
            </a>
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

          <button style={{ width: "96px", marginTop: "1em" }}>Login</button>
        </form>
      )}
    </>
  );
}

export default LoginWindow;
