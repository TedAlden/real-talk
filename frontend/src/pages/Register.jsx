import viteLogo from "/vite.svg";
import RegisterWindow from "../components/RegisterWindow";

function Register() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <RegisterWindow />
    </>
  );
}

export default Register;
