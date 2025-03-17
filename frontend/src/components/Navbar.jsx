import { Link } from "react-router-dom";
import { Navbar, DarkThemeToggle } from "flowbite-react";

import useAuth from "../hooks/useAuth";
import NavbarLink from "./NavbarLink";

export default function MyNavbar() {
  const auth = useAuth();

  return (
    <Navbar>
      <div className="container mx-auto flex items-center justify-between">
        <Navbar.Brand as={Link} href="https://flowbite-react.com">
          <img src="/realtalk.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            RealTalk
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <div className="flex items-center space-x-8">
          <Navbar.Collapse>
            <NavbarLink to="/" text="Home" />
            {auth.loggedIn ? (
              <>
                <NavbarLink to="/profile/me" text="Profile" />
                <NavbarLink to="/settings" text="Settings" />
                <NavbarLink
                  to="#"
                  text="Logout"
                  onClick={() => auth.logout()}
                />
              </>
            ) : (
              <>
                <NavbarLink to="/login" text="Login" />
                <NavbarLink to="/register" text="Register" />
              </>
            )}
          </Navbar.Collapse>
          <DarkThemeToggle />
        </div>
      </div>
    </Navbar>
  );
}
