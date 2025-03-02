import viteLogo from "/vite.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { verifyOTP } from "../api/authService";

function EnterOTP() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertMessage("");
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
        }
      );
      navigate("/");
    } else {
      console.log(response);
      setAlertMessage("Login failed! " + response.error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <form
        onSubmit={handleSubmitOTP}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Enter your pin</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "0.75em",
            textAlign: "right",
          }}
        >
          <label>Pin:</label>
          <input type="text" onChange={(e) => setPin(e.target.value)} />
        </div>
        <div
          style={{
            background: "red",
            color: "white",
            padding: "0.5em",
            width: "100%",
            margin: "1em",
            minHeight: "2em",
            borderRadius: "5px",
            visibility: alertMessage ? "visible" : "hidden",
          }}
        >
          {alertMessage}
        </div>
        <button style={{ width: "96px", marginTop: "1em" }}>Send</button>
      </form>
    </>
  );
}

export default EnterOTP;
