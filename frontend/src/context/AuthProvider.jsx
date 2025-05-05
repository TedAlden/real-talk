import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, verifyOTP } from "../api/authService";
import { getUserById } from "../api/userService";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authCookie = getCookie();
    if (authCookie && authCookie.type === "authenticated") {
      setLoggedIn(true);
    }
    // TODO: validate this cookie's token against it's userId using some API
    // endpoint? it currently accepts any token and any userId as long as type
    // is "authenticated"
  }, []);

  const login = async (username, password) => {
    const response = await loginUser(username, password);

    // Successful login...
    if (response.status === 200) {
      const { token, type, userId } = response.data;

      // Construct and save auth cookie
      const authCookie = { token, type, userId };
      Cookies.set("authCookie", JSON.stringify(authCookie), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      // If full login (no 2FA or other steps required)
      if (type === "authenticated") {
        setLoggedIn(true);
        navigate("/");
      }
      // Else, if 2FA is required
      else if (type === "awaiting-otp") {
        navigate("/enter-otp");
      }
    }
    // Unsuccessful login...
    else {
      throw new Error(response.message); // i.e. Incorrect password or username
    }
  };

  const loginOtp = async (otp) => {
    const token = getCookie().token;
    const response = await verifyOTP(token, otp);

    // Successful OTP attempt
    if (response.status === 200) {
      const { token, type, userId } = response.data;

      // Construct and save new full auth cookie
      const authCookie = { token, type, userId };
      Cookies.set("authCookie", JSON.stringify(authCookie), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      setLoggedIn(true);
      navigate("/");
    }
    // Unsuccessful OTP attempt
    else {
      throw new Error(response.message); // i.e. Invalid OTP or token
    }
  };

  const getCookie = () => {
    const cookie = Cookies.get("authCookie");
    if (cookie) {
      return JSON.parse(cookie);
    } else {
      return null;
    }
  };

  const logout = () => {
    Cookies.remove("authCookie");
    setLoggedIn(false);
    navigate("/");
  };

  const getUser = async () => {
    if (loggedIn) {
      const authCookie = getCookie();
      const userData = await getUserById(authCookie.userId);
      if (userData?.data.is_banned) {
        logout();
        navigate("/login");
        return null;
      }
      return userData?.data;
    } else {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, login, loginOtp, logout, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
