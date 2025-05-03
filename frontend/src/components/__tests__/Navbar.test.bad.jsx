import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import MyNavbar from "../Navbar";
import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import NavbarLink from "../NavbarLink";
import useAuth from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth");

describe("Navbar", () => {
  const mockUser = { _id: "user123", username: "testuser" };
  it("renders the navbar", () => {
    render(
      <MyNavbar>
        <Navbar.Brand as={Link} href="https://flowbite-react.com">
          <img src="/realtalk.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            RealTalk
          </span>
        </Navbar.Brand>
      </MyNavbar>,
    );
    expect(screen.getByText("Realtalk")).toBeInTheDocument();
  });
});
