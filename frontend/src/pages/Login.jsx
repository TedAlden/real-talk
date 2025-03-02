import viteLogo from "/vite.svg";
import { useEffect, useState } from "react";
import { loginUser } from "../api/authService";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(username, password);

    if (response.status === 200) {
      setAlertMessage("");
      const { token, type, userId } = response.data;

      if (response.data.type === "awaiting-otp") {
        Cookies.set("authToken", JSON.stringify({ token, type }), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("authUser", userId, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        navigate("/enter-otp");
      } else if (response.data.type === "authenticated") {
        Cookies.set("authToken", JSON.stringify({ token, type }), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("authUser", userId, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        setLoggedIn(true);
      }
    } else {
      console.log(response);
      setAlertMessage("Login failed! " + response.error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    Cookies.remove("authToken");
    Cookies.remove("authUser");
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
          onSubmit={handleLogin}
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
              visibility: alertMessage ? "visible" : "hidden",
            }}
          >
            {alertMessage}
          </div>

          <button style={{ width: "96px", marginTop: "1em" }}>Login</button>
        </form>
      )}
    </>
  );
}

export default Login;
