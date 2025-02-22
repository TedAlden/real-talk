import viteLogo from "/vite.svg";
import LoginWindow from "../components/LoginWindow";

function Login() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <LoginWindow />
    </>
  );
}

export default Login;
