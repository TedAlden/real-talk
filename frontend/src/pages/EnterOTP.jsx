import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { verifyOTP } from "../api/authService";
import Alert from "../components/Alert";

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
        type: "danger",
        title: "Login failed!",
        message: response.message,
      });
    }
  };

  return (
    <>
      <h1 className="mb-5 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Two-factor authentication
      </h1>
      <form className="mx-auto max-w-lg" onSubmit={handleSubmitOTP}>
        <div className="mb-5">
          <label
            htmlFor="otp"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Pin
          </label>
          <input
            onChange={(e) => setPin(e.target.value)}
            type="number"
            id="otp"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="XXXXXX"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        {Object.keys(alertMessage).length > 0 && (
          <div className="mt-5">
            <Alert
              type={alertMessage.type}
              title={alertMessage.title}
              message={alertMessage.message}
            />
          </div>
        )}
      </form>
    </>
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
