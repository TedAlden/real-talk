import viteLogo from "/vite.svg";
import ForgotPasswordWindow from "../components/ForgotPasswordWindow";

function ForgotPassword() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <ForgotPasswordWindow />
    </>
  );
}

export default ForgotPassword;
