import { Link } from "react-router-dom";
import { Navbar, DarkThemeToggle } from "flowbite-react";

import useAuth from "../hooks/useAuth";
import NavbarLink from "./NavbarLink";
import Notifications from "./../private/NotificationIcon";
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
        <div className="flex items-center space-x-6">
          <Navbar.Collapse>
            <NavbarLink
              to="/"
              text = "Home">
              <img src="/realtalk.svg" alt="Home" />
            </NavbarLink>
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
                <NavbarLink to="/landing" text="Login/ Register" />
              </>
            )}
          </Navbar.Collapse>
          <Notifications />
          <DarkThemeToggle />
        </div>
      </div>
    </Navbar>
  );
}
