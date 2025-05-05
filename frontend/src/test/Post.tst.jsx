import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Post from "../components/Post";
import * as userCache from "../hooks/useUserCache";
import * as authHook from "../hooks/useAuth";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

vi.mock("../Composer", () => ({
  default: ({ onSubmit, onCancel }) => (
    <div>
      <button onClick={() => onSubmit("Post Content")}>Submit</button>
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
  post_id: "post-1",
  user_id: "user-1",
  content: "Post content",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const queryClient = new QueryClient();
describe("Post page", () => {
  <QueryClientProvider client={queryClient}>
    <Post />
  </QueryClientProvider>;
});

const setup = (viewerId = "user-1") => {
  vi.spyOn(userCache, "useCachedUser").mockReturnValue(mockUser);
  vi.spyOn(authHook, "default").mockReturnValue({
    getUser: () => Promise.resolve({ _id: viewerId }),
  });

  const onDelete = vi.fn();

  render(
    <QueryClientProvider client={queryClient}>
      <Post post={post} user_id="user-1" onDelete={onDelete} />;
    </QueryClientProvider>,
  );
  return { onDelete };
};

describe("Post component", () => {
  it("Displays posters username and post content", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("@username-1")).toBeInTheDocument();
    });
  });
});
