import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginWindow from "./components/LoginWindow";
function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <div className="card">
        <LoginWindow></LoginWindow>
      </div>
    </>
  );
}

export default App;
