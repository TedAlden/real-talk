import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authService";

import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Label, TextInput } from "flowbite-react";

/**
 * Password reset page that validates token and handles password update
 * Redirects if no valid token is present
 */
function ResetPassword() {
  // Navigation and token handling
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Form state management
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Check for valid token
  useEffect(() => {
    // Redirect away immediately if no token is found
    if (!token) {
      navigate("/");
      return;
    }
  });

  // Handle password update submission
  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Check password and confirm-password match
    if (newPassword != confirmedPassword) {
      setAlertMessage({
        color: "failure",
        title: "Passwords do not match!",
      });
      return;
    }

    // Reset password using auth service
    await resetPassword(token, newPassword).then((response) => {
      if (response.success !== false) {
        setAlertMessage({
          color: "success",
          title: "Password successfully updated!",
        });
      } else {
        setAlertMessage({
          color: "failure",
          title: "Password update failed!",
          message: response.message,
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
        {/* Password reset form container */}
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          {/* Form header */}
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Forgotten your password?
          </h1>

          {/* Password reset form */}
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleSubmitPassword}
          >
            {/* New password input */}
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

            {/* Alert messages */}
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
