import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Post from "../components/Post";
import * as userCache from "../hooks/useUserCache";
import * as authHook from "../hooks/useAuth";
import * as postService from "../api/postService";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../components/DropdownMenu", () => ({
  __esModule: true,
  default: ({ items }) => (
    <div>
      {items.map((item, index) => (
        <button key={index} onClick={item.action}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../components/Composer", () => ({
  __esModule: true,
  default: ({ onSubmit, onCancel }) => (
    <div>
      <button onClick={() => onSubmit("Updated content")}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

const mockUser = {
  _id: "user-1",
  username: "username-1",
  profile_picture: "user-profile-pic.jpg",
};

const post = {
  _id: "post-1",
  user_id: "user-1",
  content: "Post content",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  likes: [],
  comments: [],
  poster: mockUser,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const setup = (viewerId = "user-1") => {
  vi.spyOn(userCache, "useCachedUser").mockReturnValue(mockUser);
  vi.spyOn(userCache, "useCacheUpdater").mockReturnValue(() => {});
  vi.spyOn(authHook, "default").mockReturnValue({
    getUser: () => Promise.resolve({ _id: viewerId }),
  });

  const onDelete = vi.fn();

  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {" "}
        <Post
          post={post}
          viewer={viewerId === "user-1" ? mockUser : { _id: viewerId }}
          onDelete={onDelete}
        />
      </BrowserRouter>
    </QueryClientProvider>,
  );
  return { onDelete };
};

describe("Post component", () => {
  it("displays posters username and post content", async () => {
    setup();
    expect(screen.getByTestId("post-username")).toHaveTextContent(
      "@username-1",
    );
    expect(screen.getByTestId("post-text")).toHaveTextContent("Post content");
  });

  it("displays edit and delete options for post creator", async () => {
    setup();
    const editButton = screen.getByText("Edit post");
    const deleteButton = screen.getByText("Delete post");

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("does not show edit and delete options for other users", async () => {
    setup("user-2");

    expect(screen.queryByText("Edit post")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete post")).not.toBeInTheDocument();
    expect(screen.getByText("Report post")).toBeInTheDocument();
  });

  it("allows deleting a post", async () => {
    const { onDelete } = setup();
    vi.spyOn(postService, "deletePostById").mockResolvedValue({
      success: true,
    });

    fireEvent.click(screen.getByText("Delete post"));

    await waitFor(() => {
      expect(postService.deletePostById).toHaveBeenCalledWith("post-1");
      expect(onDelete).toHaveBeenCalledWith("post-1");
    });
  });

  it("enters edit mode and updates post", async () => {
    setup();

    fireEvent.click(screen.getByText("Edit post"));
    expect(screen.getByText("Submit")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Submit"));

    expect(screen.getByTestId("post-text")).toHaveTextContent(
      "Updated content",
    );
  });

  it("cancels edit mode", async () => {
    setup();

    fireEvent.click(screen.getByText("Edit post"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByTestId("post-text")).toHaveTextContent("Post content");
  });
});
