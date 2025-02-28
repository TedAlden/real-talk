import viteLogo from "/vite.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function EnterOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [pin, setPin] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (!token) {
      // navigate("/");
      return;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit pin
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
        onSubmit={handleSubmit}
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
            visibility: alert ? "visible" : "hidden",
          }}
        >
          {alert}
        </div>
        <button style={{ width: "96px", marginTop: "1em" }}>Send</button>
      </form>
    </>
  );
}

export default EnterOTP;
