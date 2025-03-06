import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { verifyOTP } from "../api/authService";

import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button, Label, TextInput } from "flowbite-react";

function EnterOTP() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [alertMessage, setAlertMessage] = useState({});

  const token = JSON.parse(Cookies.get("authToken"));

  useEffect(() => {
    if (!token || token.type !== "awaiting-otp") {
      navigate("/");
      return;
    }
  }, [token, navigate]);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();

    const response = await verifyOTP(token.token, pin);

    if (response.status === 200) {
      setAlertMessage({});
      Cookies.set(
        "authToken",
        JSON.stringify({
          token: response.data.token,
          type: response.data.type,
        }),
        {
          expires: 7,
          secure: true,
          sameSite: "strict",
        },
      );
      navigate("/");
    } else {
      console.log(response);
      setAlertMessage({
        color: "failure",
        title: "Login failed!",
        message: response.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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

// <div>
//   <a href="https://vite.dev" target="_blank">
//     <img src={viteLogo} className="logo" alt="Vite logo" />
//   </a>
// </div>
// <h1>REAL TALK</h1>
// <form
//   onSubmit={handleSubmitOTP}
//   style={{
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   }}
// >
//   <p>Enter your pin</p>
//   <div
//     style={{
//       display: "grid",
//       gridTemplateColumns: "1fr 2fr",
//       gap: "0.75em",
//       textAlign: "right",
//     }}
//   >
//     <label>Pin:</label>
//     <input type="text" onChange={(e) => setPin(e.target.value)} />
//   </div>
//   <div
//     style={{
//       background: "red",
//       color: "white",
//       padding: "0.5em",
//       width: "100%",
//       margin: "1em",
//       minHeight: "2em",
//       borderRadius: "5px",
//       visibility: alertMessage ? "visible" : "hidden",
//     }}
//   >
//     {alertMessage}
//   </div>
//   <button style={{ width: "96px", marginTop: "1em" }}>Send</button>
// </form>
