import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import renderWithProviders from "./setupTests";
import UserProfile from "../pages/UserProfile";

describe("User Profile Flow", () => {
  // Setup some mocks for the fetched users/posts/stats
  const mockViewer = {
    _id: "123456",
    username: "vieweruser",
  };

  const mockProfileUser = {
    _id: "654321",
    username: "profileuser",
    first_name: "John",
    last_name: "Doe",
    biography: "This is my test bio",
    profile_picture: "/profile-avatar.jpg",
  };

  const mockPosts = [
    {
      _id: "1",
      user_id: "654321",
      content: "This is test post 1",
      created_at: new Date(Date.now() - 100000).toISOString(),
      updated_at: new Date(Date.now() - 100000).toISOString(),
      likes: ["user123", "user789"],
      comments: [
        {
          _id: "1111",
          user_id: "user123",
          content: "test comment1",
          created_at: new Date(Date.now() - 50000).toISOString(),
          updated_at: new Date(Date.now() - 50000).toISOString(),
        },
      ],
    },
    {
      _id: "2",
      user_id: "654321",
      content: "This is test post 2",
      created_at: new Date(Date.now() - 200000).toISOString(),
      updated_at: new Date(Date.now() - 200000).toISOString(),
      likes: [],
      comments: [],
    },
  ];

  const mockFollowStats = {
    followingUser: 42,
    followedByUser: 108,
  };

  vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
      ...actual,
      useParams: vi.fn(),
    };
  });

  vi.mock("../hooks/useAuth");

  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("displays other's profile with follow", async () => {
    // Mock API responses
    const reactRouter = await import("react-router-dom");
    reactRouter.useParams.mockReturnValue({ id: mockProfileUser._id });

    const userService = await import("../api/userService");
    userService.getUserById.mockResolvedValueOnce({
      success: true,
      data: mockProfileUser,
    });
    userService.getUsersByQuery.mockResolvedValue({
      success: true,
      data: [mockProfileUser],
    });

    const postService = await import("../api/postService");
    postService.getPostByQuery.mockResolvedValueOnce({
      success: true,
      data: mockPosts,
    });

    const followersService = await import("../api/followersService");
    followersService.getFollowStatsById.mockResolvedValueOnce({
      success: true,
      data: mockFollowStats,
    });

    followersService.checkIsFollowing.mockResolvedValueOnce({
      success: true,
      data: false,
    });

    const useAuth = await import("../hooks/useAuth");
    useAuth.default.mockReturnValue({
      loggedIn: true,
      user: mockViewer,
      getUser: vi.fn().mockResolvedValue(mockViewer),
    });

    // Render profile page with route param
    renderWithProviders(<UserProfile />, {
      route: `/profile/${mockProfileUser._id}`,
    });

    // wait for loading to finish (spinner disappears)
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    //verify profile header info is there
    // PP
    expect(screen.getByTestId("main-profile-picture")).toBeInTheDocument();

    // Username
    expect(screen.getByTestId("profile-username").textContent).toContain(
      mockProfileUser.username,
    );
    // full name
    expect(screen.getByTestId("profile-full-name").textContent).toContain(
      mockProfileUser.first_name,
      mockProfileUser.last_name,
    );
    // Bio
    expect(screen.getByTestId("profile-bio").textContent).toContain(
      mockProfileUser.biography,
    );

    // Verify follow stats are displayed
    expect(screen.getByTestId("profile-followed-count").textContent).toContain(
      mockFollowStats.followedByUser,
      "followers",
    );
    expect(screen.getByTestId("profile-following-count").textContent).toContain(
      mockFollowStats.followingUser,
      "following",
    );

    // Verify follow button is present (since not following)
    const followButton = screen.getByRole("button", { name: /follow/i });
    expect(followButton).toBeInTheDocument();

    // Verify posts
    const renderedPosts = screen.getAllByTestId("post");
    expect(renderedPosts).toHaveLength(2);

    expect(
      within(renderedPosts[0]).getByTestId("post-content").textContent,
    ).toContain(mockPosts[0].content);

    expect(
      within(renderedPosts[0]).getByTestId("post-username").textContent,
    ).toContain(mockProfileUser.username);

    expect(
      within(renderedPosts[1]).getByTestId("post-content").textContent,
    ).toContain(mockPosts[1].content);
    expect(
      within(renderedPosts[1]).getByTestId("post-username").textContent,
    ).toContain(mockProfileUser.username);

    //check post creator is not there
    expect(
      screen.queryByTestId("profile-post-composer"),
    ).not.toBeInTheDocument();
  }, 5000);

  it("displays own profile with post creator", async () => {
    // Mock APIs same as before but with profile user = viewer
    const userService = await import("../api/userService");
    userService.getUserById.mockResolvedValueOnce({
      success: true,
      data: mockViewer, // Same user = own profile
    });

    const postService = await import("../api/postService");
    postService.getPostByQuery.mockResolvedValueOnce({
      success: true,
      data: mockPosts,
    });

    const followersService = await import("../api/followersService");
    followersService.getFollowStatsById.mockResolvedValueOnce({
      success: true,
      data: mockFollowStats,
    });

    followersService.checkIsFollowing.mockResolvedValueOnce({
      success: true,
      data: false,
    });

    const useAuth = await import("../hooks/useAuth");
    useAuth.default.mockReturnValue({
      loggedIn: true,
      user: mockViewer,
      getUser: vi.fn().mockResolvedValue(mockViewer),
    });

    //This is called by useCacheUpdater
    userService.getUsersByQuery.mockResolvedValueOnce({
      success: true,
      data: [mockViewer], // Same user = own profile
    });

    const reactRouter = await import("react-router-dom");
    reactRouter.useParams.mockReturnValue({ id: mockProfileUser._id });
    // Render profile page with own ID
    renderWithProviders(<UserProfile />, {
      route: `/profile/me`,
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    }, 5000);

    //post creator is there
    expect(screen.getByTestId("profile-post-composer")).toBeInTheDocument();
  }, 5000);
});
