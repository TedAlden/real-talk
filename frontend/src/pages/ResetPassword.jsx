import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authService";

import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Label, TextInput } from "flowbite-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect immediately if no token is found
      return;
    }
  });

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (newPassword != confirmedPassword) {
      setAlertMessage({
        color: "failure",
        title: "Passwords do not match!",
      });
      return;
    }

    const response = await resetPassword(token, newPassword);

    if (response.success !== false) {
      setAlertMessage({
        color: "success",
        title: "Password successfully updated!",
      });
    } else {
      console.error(response);
      setAlertMessage({
        color: "failure",
        title: "Password update failed!",
        message: response.message,
      });
    }
  };

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgotten your password?
          </h1>
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleSubmitPassword}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password-1" value="New Password" />
              </div>
              <TextInput
                id="password-1"
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password-2" value="Confirm Password" />
              </div>
              <TextInput
                id="password-2"
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Update</Button>
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

export default ResetPassword;
