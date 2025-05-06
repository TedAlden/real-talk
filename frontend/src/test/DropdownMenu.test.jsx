import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DropdownMenu from "../components/DropdownMenu";

// Create a simple test icon component
const TestIcon = () => <span data-testid="test-icon">Icon</span>;

describe("DropdownMenu", () => {
  const mockEditAction = vi.fn();
  const mockDeleteAction = vi.fn();
  const mockDisabledAction = vi.fn();
  let items;

  beforeEach(() => {
    mockEditAction.mockReset();
    mockDeleteAction.mockReset();
    mockDisabledAction.mockReset();

    items = [
      { label: "Edit", action: mockEditAction, icon: <TestIcon /> },
      { label: "Delete", action: mockDeleteAction, icon: null },
      {
        label: "Archive",
        action: mockDisabledAction,
        icon: null,
        disabled: true,
      },
    ];
  });

  it("opens the menu when clicking the button", () => {
    render(<DropdownMenu items={items} />);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    const menuButton = screen.getByLabelText("Options menu");
    fireEvent.click(menuButton);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
  });

  it("renders icons when provided", () => {
    render(<DropdownMenu items={items} />);

    const menuButton = screen.getByLabelText("Options menu");
    fireEvent.click(menuButton);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("toggles the dropdown when clicking the button multiple times", () => {
    render(<DropdownMenu items={items} />);
    const menuButton = screen.getByLabelText("Options menu");

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByText("Edit")).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("doesn't trigger action for disabled menu items", () => {
    render(<DropdownMenu items={items} />);

    // Open the menu
    const menuButton = screen.getByLabelText("Options menu");
    fireEvent.click(menuButton);

    // Find and click the disabled item
    const archiveButton = screen.getByText("Archive");
    expect(archiveButton).toBeDisabled();
    fireEvent.click(archiveButton);

    // Verify action was not called
    expect(mockDisabledAction).not.toHaveBeenCalled();
  });

  it("calls action when clicking a menu item", () => {
    render(<DropdownMenu items={items} />);

    // Open the menu
    const menuButton = screen.getByLabelText("Options menu");
    fireEvent.click(menuButton);

    // Find and click the edit item
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    // Verify action was called
    expect(mockEditAction).toHaveBeenCalledTimes(1);

    // Menu should close after clicking an item
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });
});
