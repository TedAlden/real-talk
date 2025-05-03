import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Topbar from "../Topbar";import * as authHook from "../../hooks/useAuth";

vi.spyOn(authHook, "default").mockReturnValue({
  logout: vi.fn(), // ✅ Mock logout
  getUser: vi.fn().mockResolvedValue({ _id: "user-1" }), // or whatever your component uses
});


describe("Topbar", () => {
  it("displays the timer", () => {
    render(<Topbar />);
    expect(screen.getByRole("timerbar")).toBeInTheDocument();
  });
});
