import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostCarousel from "../components/PostCarousel";
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
    expect(images).not.toHaveLength(0);
    expect(images).not.toHaveLength(2);
  });
  const image_map_2 = ["../../assets/test.webp", "../../assets/test.webp", "../../assets/test.webp"]; // 3 images
  it("displays the correct number of images if given an image map of more than one image", () => {
    render(<PostCarousel images={image_map_2} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    expect(images).not.toHaveLength(2);
    expect(images).not.toHaveLength(4); // Five is right out
  });
});
