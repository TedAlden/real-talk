import viteLogo from "/vite.svg";
import ResetPasswordWindow from "../components/ResetPasswordWindow";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <ResetPasswordWindow token={token} />
    </>
  );
}

export default ResetPassword;
