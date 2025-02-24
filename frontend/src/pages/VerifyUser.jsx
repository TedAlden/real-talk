import viteLogo from "/vite.svg";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authService";

function VerifyUser() {
  const [searchParams] = useSearchParams();
  const [alert, setAlert] = useState("Verifying token, please wait...");
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!(token && email)) {
      navigate("/"); // Redirect immediately if no token is found
      return;
    }

    const verifyUser = async () => {
      const submittedUser = { token, email };
      const response = await verifyEmail(submittedUser); // Await the API call

      if (response.success !== false) {
        setAlert("Congratulations! You are now verified!");
      } else {
        console.error(response);
        setAlert("Verification failed! " + (response.error || "Unknown error"));
      }
    };

    verifyUser();
  }, [token, email, navigate]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <p>{alert}</p>
    </>
  );
}

export default VerifyUser;
