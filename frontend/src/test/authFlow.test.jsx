import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import renderWithProviders, { mockNavigate } from "./setupTests";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Navbar from "../components/Navbar";

describe("Authentication Flow", () => {
  const mockUser = {
    _id: "user123",
    username: "testuser",
    email: "test@example.com",
  };

  beforeEach(() => {
    // Reset things before each test
    vi.resetAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("register, login then logout", async () => {
    // Mock the api calls
    const authService = await import("../api/authService");
    authService.registerUser.mockResolvedValueOnce({
      success: true,
      data: { message: "Registration successful" },
      status: 201,
    });
    authService.loginUser.mockResolvedValueOnce({
      success: true,
      data: {
        token: "fake-token",
        userId: mockUser._id,
        type: "authenticated",
      },
      status: 200,
    });

    const userService = await import("../api/userService");
    userService.getUserById.mockResolvedValue({
      success: true,
      data: mockUser,
      status: 200,
    });

    // mock the register page
    const { user: regUser, unmount: unmountRegister } = renderWithProviders(
      <Register />,
      {
        route: "/register",
      },
    );

    // enter user info for registration
    await regUser.type(screen.getByLabelText(/username/i), "testuser");
    await regUser.type(screen.getByLabelText(/email/i), "test@example.com");
    await regUser.type(screen.getByLabelText(/password/i), "Password123!");

    // Tick the t and c box
    const termsCheckbox = screen.getByLabelText(/terms/i);
    await regUser.click(termsCheckbox);

    // Click register
    const registerButton = screen.getByRole("button", {
      name: /create account/i,
    });
    await regUser.click(registerButton);

    // Check registerUser was called with provided values
    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        "Password123!",
      );
    });

    // get rid of register page
    unmountRegister();

    // mock the login page with navbar
    const { user: loginUser } = renderWithProviders(
      <>
        <Navbar />
        <Login />
      </>,
    );

    // enter user info for login
    await loginUser.type(screen.getByLabelText(/username/i), "testuser");
    await loginUser.type(screen.getByLabelText(/password/i), "Password123!");

    // press login
    const loginButton = screen.getByRole("button", { name: /sign in/i });
    await loginUser.click(loginButton);

    // Check loginUser was called with right values
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith(
        "testuser",
        "Password123!",
      );
    });

    // if user is logged in they should see logout buttons
    await waitFor(() => {
      // 2 logout text, one in button, one in navbar
      const logoutLinks = screen.getAllByText("Logout");
      expect(logoutLinks).toHaveLength(2);
    });
    // click logout link
    await loginUser.click(screen.getAllByText("Logout"))[0];

    // Check it navigates to home afte rlogout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  }, 5000);
});
