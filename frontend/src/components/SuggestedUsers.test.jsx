import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuggestedUsers from "./SuggestedUsers";
import { getSuggestedFollows } from "../api/followersService";
import useAuth from "../hooks/useAuth";

vi.mock("../api/followersService");
vi.mock("../hooks/useAuth");

describe("SuggestedUsers", () => {
  const mockUser = { _id: "user123", username: "testuser" };
  const mockSuggestions = [
    {
      _id: "user1",
      username: "user1",
      profile_picture: "/img1.jpg",
      mutualCount: 2,
    },
    {
      _id: "user2",
      username: "user2",
      profile_picture: "/img2.jpg",
      mutualCount: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      getUser: vi.fn().mockResolvedValue(mockUser),
    });

    getSuggestedFollows.mockResolvedValue({
      success: true,
      data: mockSuggestions,
    });
  });

  it("returns null when method is invalid", async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    let container;
    await act(async () => {
      const result = render(<SuggestedUsers method="invalid" />);
      container = result.container;
    });
    expect(container).toBeEmptyDOMElement();
    console.error = originalConsoleError;
  });

  it("fetches suggestions on render", async () => {
    await act(async () => {
      render(<SuggestedUsers method="mutuals" />);
    });

    await waitFor(() => {
      expect(useAuth().getUser).toHaveBeenCalled();
      expect(getSuggestedFollows).toHaveBeenCalledWith("user123", "mutuals");
    });

    expect(await screen.findByText("@user1")).toBeInTheDocument();
    expect(await screen.findByText("@user2")).toBeInTheDocument();
  });

  it("displays the correct mutual follows", async () => {
    await act(async () => {
      render(<SuggestedUsers method="mutuals" />);
    });

    expect(await screen.findByText("2 mutual follows")).toBeInTheDocument();
    expect(await screen.findByText("1 mutual follow")).toBeInTheDocument();
  });

  it("displays message when no suggestions are available", async () => {
    getSuggestedFollows.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    render(<SuggestedUsers />);

    expect(await screen.findByText("No suggested users.")).toBeInTheDocument();
  });
});
