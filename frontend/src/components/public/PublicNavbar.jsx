import { Link } from "react-router-dom";
import { Navbar, DarkThemeToggle } from "flowbite-react";
import NavbarLink from "./NavbarLink"; // still in public

export default function PublicNavbar() {
  return (
    <Navbar>
      <div className="container mx-auto flex items-center justify-between">
        <Navbar.Brand as={Link} href="/">
          <img src="/realtalk.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            RealTalk
          </span>
        </Navbar.Brand>

        <Navbar.Toggle />

        <div className="flex items-center space-x-6">
          <Navbar.Collapse>
            <NavbarLink to="/" text="Home" />
            <NavbarLink to="/landing" text="Login/Register" />
            <NavbarLink to="/profile/me" text="Profile" />
          </Navbar.Collapse>

          <DarkThemeToggle />
        </div>
      </div>
    </Navbar>
  );
}
