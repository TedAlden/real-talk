import { useEffect, useState } from "react";
import { loginUser } from "../api/authService";
import Cookies from "js-cookie";

export default function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (Cookies.get("authToken")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username,
      password,
    };
    const response = await loginUser(submittedUser);

    if (response.success !== false) {
      setAlertMessage("");
      setLoggedIn(true);
      Cookies.set("authToken", response.data.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
    } else {
      console.log(response);
      setAlertMessage("Login failed! " + response.error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    Cookies.remove("authToken");
  };

  return {
    handleLogin,
    handleLogout,
    setUsername,
    setPassword,
    loggedIn,
    alertMessage,
  };
}
