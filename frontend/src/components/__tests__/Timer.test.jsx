import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import usePersistentTimer from "../../hooks/usePersistentTimer";
import Timer from "../Timer";
import { useContext, useEffect } from "react";
import * as authHook from "../../hooks/useAuth";

vi.spyOn(authHook, "default").mockReturnValue({
  logout: vi.fn(),
  getUser: vi.fn().mockResolvedValue({ _id: "user-1" }),
});

describe("Timer", () => {
  it("starts with the correct amount of time", () => {
    render(<Timer />);
    expect(screen.getByText("20:00")).toBeInTheDocument();
  });
});
