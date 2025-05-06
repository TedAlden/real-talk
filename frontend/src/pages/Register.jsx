import { useState } from "react";
import { registerUser } from "../api/authService";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { HiInformationCircle } from "react-icons/hi";
import {
  Alert,
  Button,
  Checkbox,
  Label,
  TextInput,
  Datepicker,
} from "flowbite-react";

function Register() {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    date_of_birth: new Date(),
  });
  const [alertMessage, setAlertMessage] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(formData);

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
            Create an account
          </h1>
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleRegister}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="yourname@site.com"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="username"
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date_of_birth" value="Date of Birth" />
              </div>
              <Datepicker
                id="date_of_birth"
                name="date_of_birth"
                maxDate={new Date()}
                required
                weekStart={1}
                onChange={(value) =>
                  setFormData({ ...formData, date_of_birth: value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms">
                I accept the{" "}
                <Link
                  className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                  to="#"
                >
                  Terms and Conditions
                </Link>
              </Label>
            </div>
            <Button type="submit">Create account</Button>
            {Object.keys(alertMessage).length > 0 && (
              <div>
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

export default Register;
