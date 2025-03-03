import { useEffect, useState } from "react";
import { loginUser } from "../api/authService";
import { Link, useNavigate } from "react-router-dom";

import Alert from "../components/Alert";

import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});

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
      setAlertMessage({});
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
      setAlertMessage({
        type: "danger",
        title: "Login failed!",
        message: response.message,
      });
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    Cookies.remove("authToken");
    Cookies.remove("authUser");
  };

  return (
    <>
      {loggedIn ? (
        <form onSubmit={handleLogout}>
          <p>You are logged in</p>
          <button style={{ width: "96px" }}>Logout</button>
        </form>
      ) : (
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
            <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 className="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your RealTalk account
                </h1>
                <form
                  className="mx-auto max-w-lg space-y-6"
                  onSubmit={handleLogin}
                >
                  <div className="">
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      id="username"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="username"
                      required
                    />
                  </div>
                  <div className="">
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      id="password"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="remember"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded-sm border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                        />
                      </div>
                      <label
                        htmlFor="remember"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Login
                  </button>
                  <div className="">
                    <p
                      id="helper-text-explanation"
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Not registered?{" "}
                      <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        Create an account
                      </Link>
                      .
                    </p>
                  </div>
                  {Object.keys(alertMessage).length > 0 && (
                    <div className="">
                      <Alert
                        type={alertMessage.type}
                        title={alertMessage.title}
                        message={alertMessage.message}
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Login;
