import viteLogo from "/vite.svg";
import useLogin from "../hooks/useLogin";

function Login() {
  const {
    handleSubmit,
    handleLogout,
    setUsername,
    setPassword,
    loggedIn,
    alertMessage,
  } = useLogin();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      {loggedIn ? (
        <form onSubmit={handleLogout}>
          <p>You are logged in</p>
          <button style={{ width: "96px" }}>Logout</button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "0.75em",
              textAlign: "right",
            }}
          >
            <label>Username:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} />

            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            style={{
              textAlign: "right",

              width: "100%",
            }}
          >
            <a href="/forgot-password">
              <small>Forgot Password</small>
            </a>
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

          <button style={{ width: "96px", marginTop: "1em" }}>Login</button>
        </form>
      )}
    </>
  );
}

export default Login;
