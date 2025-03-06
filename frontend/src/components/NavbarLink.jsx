import { useLinkClickHandler, useLocation } from "react-router-dom";
import { Navbar } from "flowbite-react";

export default function NavbarLink({ to, text }) {
  const location = useLocation();
  const clickHandler = useLinkClickHandler(to);

  return (
    <span onClick={clickHandler}>
      <Navbar.Link href={to} active={location.pathname === to}>
        {text}
      </Navbar.Link>
    </span>
  );
}
