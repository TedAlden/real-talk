import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  it("returns null when method is invalid", () => {
    const { container } = render(<SuggestedUsers method="invalid" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("fetches suggestions on render", async () => {
    render(<SuggestedUsers />);

    await waitFor(() => {
      expect(useAuth().getUser).toHaveBeenCalled();
      expect(getSuggestedFollows).toHaveBeenCalledWith("user123", "mutuals");
    });

    expect(await screen.findByText("@user1")).toBeInTheDocument();
    expect(await screen.findByText("@user2")).toBeInTheDocument();
  });

  it("displays the correct mutual follows", async () => {
    render(<SuggestedUsers />);

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
