import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authService";

import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

/**
 * Email verification page that handles token validation
 * Displays verification status and redirects if there's no token
 */
function VerifyUser() {
  // Navigation and URL params
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Alert message state
  const [alertMessage, setAlertMessage] = useState({
    color: "info",
    title: "Verifying token!",
    message: "Please wait...",
  });

  // Get verification params from URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Handle verification on mount
  useEffect(() => {
    // Redirect away immediately if no token is found
    if (!(token && email)) {
      navigate("/");
      return;
    }

    // Verify email using auth service
    verifyEmail(email, token).then((response) => {
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
    });
  }, [navigate, email, token]);

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
