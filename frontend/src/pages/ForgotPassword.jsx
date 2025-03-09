import { useState } from "react";
import { sendResetEmail } from "../api/authService";

import { HiAtSymbol, HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const response = await sendResetEmail(email);

    if (response.success !== false) {
      setAlertMessage({
        color: "success",
        title: "Password reset email sent!",
      });
    } else {
      setAlertMessage({
        color: "failure",
        title: "Password reset failed!",
        message: response.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Forgotten your password?
          </h1>
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleSubmitEmail}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                icon={HiAtSymbol}
                placeholder="username@site.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit">Send</Button>
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

export default ForgotPassword;
