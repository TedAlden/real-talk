import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Composer from "../components/Composer";
import { describe } from "vitest";

describe("Composer", () => {
  it("correctly renders composer component awaiting input", () => {
    render(<Composer mode="createPost" />);
    expect(screen.getByText("Write something...")).toBeInTheDocument();
  });
});
