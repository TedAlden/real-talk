import { render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import Alert from "../components/Alert"

describe("Alert", () => {
    it("displays title and message", () => {
        render(<Alert show={"oui oui, hon hon baguette"} title={"alert_title"} message={"alert_message"} />);
        expect(screen.getByText("alert_title")).toBeInTheDocument();
        expect(screen.getByText("alert_message")).toBeInTheDocument();

        expect(screen.queryByText("different_title")).not.toBeInTheDocument();
        expect(screen.queryByText("different_message")).not.toBeInTheDocument();
    })
})