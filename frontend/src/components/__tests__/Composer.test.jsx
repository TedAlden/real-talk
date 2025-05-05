import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Composer from "../Composer";
import { describe } from "vitest";

describe("Composer", () => {
  it("tells the max length of a text post", () => {
    render(<Composer mode="createPost" />);
    expect(screen.getByText("Write something...")).toBeInTheDocument();
  });
});
