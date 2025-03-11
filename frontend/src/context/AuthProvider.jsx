import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { getUserById } from "../api/userService";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get("authToken"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      (async () => {
        const u = await getUserById(Cookies.get("authUserId"));
        setUser(u.data);
        console.log("Persisted");
      })();
    }
  }, [token, user]);

  const login = async (username, password) => {
    const response = await loginUser(username, password);

    if (response.status === 200) {
      const { token, type, userId } = response.data;

      if (response.data.type === "awaiting-otp") {
        Cookies.set("authToken", JSON.stringify({ token, type }), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        navigate("/enter-otp");
      } else if (response.data.type === "authenticated") {
        const u = await getUserById(userId);
        Cookies.set("authUserId", u.data._id);
        Cookies.set("authToken", JSON.stringify({ token, type }), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        setUser(u.data);
        setToken(token);
        navigate("/");
      }
    }
  };

  const logout = () => {
    Cookies.remove("authUserId");
    Cookies.remove("authToken");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  async function getUser() {
    if (token && !user) {
      const u = await getUserById(Cookies.get("authUserId"));
      setUser(u.data);
      console.log("Persisted");
      return u.data;
    }
    return user;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
