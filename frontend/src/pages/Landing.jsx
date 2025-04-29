import Login from "./Login";
import Register from "./Register";

import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";

function Landing() {
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({});
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(username, email, password);

    if (response.success !== false) {
      setAlertMessage({
        color: "success",
        title: "Registration successful!",
        message: "Check your email for a verification link.",
      });
    } else {
      setAlertMessage({
        color: "failure",
        title: "Registration failed!",
        message: response.message,
      });
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try {
        await auth.login(username, password);
      } catch (err) {
        setAlertMessage({
          color: "failure",
          title: "Login failed!",
          message: err.message,
        });
      }
    }
  };

  return auth.loggedIn ? (
    <form onSubmit={auth.logout}>
      {/*  className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800" */}
      <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
        Welcome!
      </h1>
      <p className="my-5 text-gray-900 dark:text-white">
        You are already logged in! Please log out to view this page.
      </p>
      <Button type="submit" style={{ width: "96px" }}>
        Logout
      </Button>
    </form>
  ) : (
    <div className="flex flex-col items-center justify-center">
      {/*  Handle animation between login and registration forms */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "Login" : "Register"}
          initial={{ x: 250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -250, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {isLogin ? <Login /> : <Register />}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={toggleForm}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin
          ? "Not already registered? Register here"
          : "Already signed up? Login here"}
      </button>
    </div>
  );
}

export default Landing;
