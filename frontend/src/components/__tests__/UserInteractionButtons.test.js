import UserInteractionButtons from "../private/UserInteractionButtons";
import * as followerAPI from "../../api/followersService";
import { screen, render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../api/followersService");

describe("UserInteractionButtons", () => {
  const viewerId = "user-1";
  const targetId = "user-2";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Does not display if IDs are identical", () => {
    const { container } = render(
      <UserInteractionButtons
        viewerId="test-id"
        targetId="test-id"
        isFollowing={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays follow button if not following user", () => {
    render(
      <UserInteractionButtons
        viewerId={viewerId}
        targetId={targetId}
        isFollowing={false}
      />
    );
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  it("display unfollow button when user is followed", () => {
    render(
      <UserInteractionButtons
        viewerId={viewerId}
        targetId={targetId}
        isFollowing={true}
      />
    );
    expect(screen.getByText("Unfollow")).toBeInTheDocument();
  });
});
