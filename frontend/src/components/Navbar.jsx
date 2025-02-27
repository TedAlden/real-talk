import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbarItem">
        <Link to="/">Home</Link>
      </div>
      <div className="navbarItem">
        <Link to="/login">Login</Link>
      </div>
      <div className="navbarItem">
        <Link to="/register">Register</Link>
      </div>
      <div className="navbarItem">
        <Link to="/profile">Profile</Link>
      </div>
    </div>
  );
}

export default Navbar;
