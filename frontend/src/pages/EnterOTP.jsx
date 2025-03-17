import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Label, TextInput } from "flowbite-react";

function EnterOTP() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [alertMessage, setAlertMessage] = useState({});

  useEffect(() => {
    if (auth?.token?.type === "authenticated") {
      // If user already has a fully authenticated token, they shouldn't be here
      navigate("/");
    }
  }, [auth.token, navigate]);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      await auth.loginOtp(pin);
    } catch (err) {
      setAlertMessage({
        color: "failure",
        title: "2FA failed!",
        message: err.message,
      });
    }
  };

  return auth.loggedIn ? (
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
  ) : (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Two-factor authentication
          </h1>
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleSubmitOTP}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="pin" value="Pin" />
              </div>
              <TextInput
                id="pin"
                type="text"
                placeholder="XXXXXX"
                required
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
            <Button type="submit">Submit</Button>
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

export default EnterOTP;
