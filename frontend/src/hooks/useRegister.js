import { useEffect, useState } from "react";
import { registerUser } from "../api/authService";
import Cookies from "js-cookie";

export default function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (Cookies.get("authToken")) {
      setLoggedIn(true);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username,
      password,
      email,
    };
    const response = await registerUser(submittedUser);

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

  return {
    handleRegister,
    handleLogout,
    setUsername,
    setEmail,
    setPassword,
    loggedIn,
    alertMessage,
  };
}
