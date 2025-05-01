import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserInteractionButtons from "../private/UserInteractionButtons";
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
});
