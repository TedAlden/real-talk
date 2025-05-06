import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "flowbite-react";

/**
 * Landing page that handles authentication forms
 * Toggles between login and registration with animation
 */
function Landing() {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  if (auth.loggedIn)
    return (
      <form onSubmit={auth.logout}>
        <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome
        </h1>
        <p className="my-5 text-gray-900 dark:text-white">
          You are already logged in! Please log out to view this page.
        </p>
        <Button type="submit" style={{ width: "96px" }}>
          Logout
        </Button>
      </form>
    );

  return (
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
