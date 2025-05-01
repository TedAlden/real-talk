import UserInteractionButtons from "./UserInteractionButtons";
import * as followerAPI from "../../api/followersService";
import { screen, render } from "@testing-library/react";

jest.mock("../../api/followersService");

describe("UserInteractionButtons", () => {
  const viewerId = "user-1";
  const targetId = "user-2";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Does not display if IDs are identical", () => {
    const { container } = render(
      <UserInteractionButtons
        viewerId="test-id"
        targetId="test-id"
        isFollowing={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("displays follow button if not following user", () => {
    render(
      <UserInteractionButtons
        viewerId={viewerId}
        targetId={targetId}
        isFollowing={false}
      />,
    );
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  test("display unfollow button when user is followed", () => {
    render(
      <UserInteractionButtons
        viewerId={viewerId}
        targetId={targetId}
        isFollowing={true}
      />,
    );
    expect(screen.getByText("Unfollow")).toBeInTheDocument();
  });
});
