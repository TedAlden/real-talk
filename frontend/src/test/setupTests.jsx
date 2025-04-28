import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock all API services
vi.mock("../api/authService");
vi.mock("../api/userService");
vi.mock("../api/postService");
vi.mock("../api/followersService");

export const mockNavigate = vi.fn();

// Test wrapper with all providers
export default function renderWithProviders(
  ui,
  { route = "/", initialEntries = [route] } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/*" element={ui} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}
