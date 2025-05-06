import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Topbar from "../components/Topbar";
import * as authHook from "../hooks/useAuth";

vi.spyOn(authHook, "default").mockReturnValue({
  logout: vi.fn(),
  getUser: vi.fn().mockResolvedValue({ _id: "user-1" }),
});

describe("Topbar", () => {
  it("displays the timer", () => {
    render(<Topbar />);
    expect(screen.getByRole("timerbar")).toBeInTheDocument();
  });
});
