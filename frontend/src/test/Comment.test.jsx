import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Comment from "../components/Comment";
import { vi } from "vitest";
import * as userCache from "../hooks/useUserCache";
import * as postService from "../api/postService";
import { BrowserRouter } from "react-router-dom";
vi.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../components/DropdownMenu", () => ({
  __esModule: true,
  default: ({ items }) => (
    <div id="dropdown">
      {items.map((item, idx) => (
        <button key={idx} onClick={item.action}>
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
      <button onClick={() => onSubmit("Updated content")}>Comment</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe("Comment component", () => {
  const mockUser = {
    _id: "user-1",
    username: "username-1",
    profile_picture: "user-profile-pic.jpg",
  };

  const mockUser2 = {
    _id: "user-2",
    username: "username-2",
    profile_picture: "user-2-profile-pic.jpg",
  };

  const comment = {
    comment_id: "comment-1",
    user_id: "user-1",
    content: "Comment content",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const setup = (viewerId = "user-1") => {
    const viewer = viewerId === "user-1" ? mockUser : mockUser2;

    vi.spyOn(userCache, "useCachedUser").mockReturnValue(mockUser);

    const onDelete = vi.fn();

    render(
      <BrowserRouter>
        <Comment
          postId="post-1"
          comment={comment}
          viewer={viewer}
          onDelete={onDelete}
        />{" "}
      </BrowserRouter>,
    );
    return { onDelete };
  };

  it("displays comment posters username and the content", async () => {
    setup();
    expect(await screen.findByText(/@username-1/)).toBeInTheDocument();
    expect(screen.getByText("Comment content")).toBeInTheDocument();
  });

  it("displays edit and delete options for comment leaver", async () => {
    setup();
    await waitFor(() => screen.getByText("Edit comment"));
    expect(screen.getByText("Edit comment")).toBeInTheDocument();
    expect(screen.getByText("Delete comment")).toBeInTheDocument();
  });

  it("does not show delete and edit options for anybody besides comment leaver", async () => {
    setup("user-2");
    await waitFor(() => screen.getByText("Report comment"));
    expect(screen.queryByText("Edit comment")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete comment")).not.toBeInTheDocument();
  });

  it("allows deleting a comment", async () => {
    const { onDelete } = setup();
    vi.spyOn(postService, "deleteComment").mockResolvedValue({ success: true });

    fireEvent.click(await screen.findByText("Delete comment"));

    await waitFor(() => {
      expect(postService.deleteComment).toHaveBeenCalledWith(
        "post-1",
        "comment-1",
      );
      expect(onDelete).toHaveBeenCalled();
    });
  });

  it("enters edit mode and updates comment", async () => {
    setup();
    fireEvent.click(await screen.findByText("Edit comment"));
    fireEvent.click(screen.getByText("Comment"));

    expect(await screen.findByText("Updated content")).toBeInTheDocument();
  });

  it("cancels edit mode", async () => {
    setup();
    fireEvent.click(await screen.findByText("Edit comment"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(await screen.findByText("Comment content")).toBeInTheDocument();
  });
});
