import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import usePersistentTimer from "../hooks/usePersistentTimer";

import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";

function Login() {
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try {
        await auth.login(username, password);
        navigate("/profile/me");
        setIsLogin(true);
        localStorage.setItem("isLoggedIn", "true");
      } catch (err) {
        setAlertMessage({
          color: "failure",
          title: "Login failed!",
          message: err.message,
        });
      }
    }
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
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Sign in to your account
          </h1>
          <form className="flex max-w-md flex-col gap-4" onSubmit={handleLogin}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Password" />
              </div>
              <TextInput
                id="password1"
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
              <Link
                to="/forgot-password"
                className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit">Sign in</Button>
            {Object.keys(alertMessage).length > 0 && (
              <div className="">
                <Alert
                  color={alertMessage.color}
                  icon={alertMessage.icon || HiInformationCircle}
                >
                  <span className="font-medium">{alertMessage.title}</span>{" "}
                  {alertMessage.message}
                </Alert>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
