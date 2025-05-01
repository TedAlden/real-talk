import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserInteractionButtons from "../UserInteractionButtons";
import * as followerAPI from "../../api/followersService";

describe("UserInteractionButtons", () => {
  it("does not display if IDs are identical", () => {
    const { container } = render(
      <UserInteractionButtons
        viewerId="test-id"
        targetId="test-id"
        isFollowing={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });
  it("does display if IDs are different", () => {
    const { container } = render(
      <UserInteractionButtons
        viewerId="test-id"
        targetId="different-id"
        isFollowing={false}
      />
    );
    expect(container.firstChild).not.toBeNull();
  });
  it('should display "Follow" button initially', () => {
    render(
      <UserInteractionButtons
        viewerId="user-1"
        targetId="user-2"
        isFollowing={false}
      />
    );
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});
