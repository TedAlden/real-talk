import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authService";

import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

function VerifyUser() {
  const [searchParams] = useSearchParams();
  const [alertMessage, setAlertMessage] = useState({
    color: "info",
    title: "Verifying token, please wait!",
  });
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!(token && email)) {
      navigate("/"); // Redirect immediately if no token is found
      return;
    }

    const verifyUser = async () => {
      const response = await verifyEmail(email, token);

      if (response.success !== false) {
        setAlertMessage({
          color: "success",
          title: "Verification successful!",
        });
      } else {
        console.error(response);
        setAlertMessage({
          color: "failure",
          title: "Verification failed!",
          message: response.error || "Unknown error",
        });
      }
    };

    verifyUser();
  }, [token, email, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {Object.keys(alertMessage).length > 0 && (
        <div className="sm:max-w-md">
          <Alert
            color={alertMessage.color}
            icon={alertMessage.icon || HiInformationCircle}
          >
            <span className="font-medium">{alertMessage.title}</span>{" "}
            {alertMessage.message}
          </Alert>
        </div>
      )}
    </div>
  );
}

export default VerifyUser;
