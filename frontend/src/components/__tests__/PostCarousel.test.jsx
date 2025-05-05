import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostCarousel from "../PostCarousel";
import { expect } from "vitest";

describe("PostCarousel", () => {
  it("does not display without images to show", () => {
    render(<PostCarousel images={""} />),
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  const image_map = ["../../assets/test.webp"];
  it("displays a single image when given a single image to display", () => {
    render(<PostCarousel images={image_map} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(1);
  });
  const image_map_2 = ["../../assets/test.webp", "../../assets/test.webp", "../../assets/test.webp"];
  it("displays a single image when given a single image to display", () => {
    render(<PostCarousel images={image_map_2} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });
});
