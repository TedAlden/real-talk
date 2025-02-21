import LoginWindow from "./LoginWindow";
import RegisterWindow from "./RegisterWindow";
import { useState } from "react";

function AuthContainer() {
  const [mode, setMode] = useState("login");
  const handleOptionChange = (e) => {
    setMode(e.target.value);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2em",
      }}
    >
      <form style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <label>
          <input
            type="radio"
            value="login"
            checked={mode === "login"}
            onChange={handleOptionChange}
          />
          Login
        </label>

        <label>
          <input
            type="radio"
            value="register"
            checked={mode === "register"}
            onChange={handleOptionChange}
          />
          Register
        </label>
      </form>
      <div
        style={{
          minHeight: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {mode == "login" ? <LoginWindow /> : <RegisterWindow />}
      </div>
    </div>
  );
}

export default AuthContainer;
