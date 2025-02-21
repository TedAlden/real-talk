import viteLogo from "/vite.svg";
import "./App.css";
import AuthContainer from "./components/AuthContainer";
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
        <AuthContainer></AuthContainer>
      </div>
    </>
  );
}

export default App;
