import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import usePersistentTimer from "../hooks/usePersistentTimer";
import Timer from "../components/Timer";
import { useContext, useEffect } from "react";
import * as authHook from "../hooks/useAuth";

beforeEach(() => {
  vi.clearAllTimers();
  vi.useFakeTimers();

  vi.spyOn(authHook, "default").mockReturnValue({
    logout: vi.fn(),
    getUser: vi.fn().mockResolvedValue({ _id: "user-1" }),
  });
});

afterEach(() => {
  vi.useFakeTimers();
});

describe("Timer", () => {
  it("starts with the correct amount of time", () => {
    render(<Timer />);
    expect(screen.getByText("20:00")).toBeInTheDocument();
  });

  // it("counts down", async () => {
  //   render(<Timer />);
  //   vi.advanceTimersByTime(1000);
  //   expect(screen.getByText("19:59")).not.toBeInTheDocument();
  // });
});
