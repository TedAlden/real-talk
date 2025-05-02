import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import UserInteractionButtons from "../UserInteractionButtons";
import * as followerAPI from "../../api/followersService";

describe("UserInteractionButtons", () => {
  beforeEach
  it("does not display if IDs are identical", () => {
    const { container } = render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-1"
        isFollowing={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
  it("does display if IDs are different", () => {
    const { container } = render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-2"
        isFollowing={false}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
  it("should display 'Follow' button initially", () => {
    render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-2"
        isFollowing={false}
      />,
    );
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });
  it("should display the report button initially", () => {
    render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-2"
        isFollowing={false}
      />,
    );
    expect(screen.getByText("Report")).toBeInTheDocument();
  });
  it("should display 'Unfollow' button when following", () => {
    render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-2"
        isFollowing={true}
      />,
    );
    expect(screen.getByText("Unfollow")).toBeInTheDocument();
  });
  it("should display the report button when following", () => {
    render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-2"
        isFollowing={true}
      />,
    );
    expect(screen.getByText("Report")).toBeInTheDocument();
  });
});
