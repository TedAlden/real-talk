import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, vitest } from "vitest";
import Alert from "../components/Alert"

describe("Alert", () => {
    it("displays title and message", () => {
        render(<Alert show={"oui oui, hon hon baguette"} title={"alert_title"} message={"alert_message"} />);
        expect(screen.getByText("alert_title")).toBeInTheDocument();
        expect(screen.getByText("alert_message")).toBeInTheDocument();
    })
})