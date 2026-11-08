
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function TestComponent() {
  return <h1>SARVASETU</h1>;
}

describe("SARVASETU Frontend", () => {
  it("renders the application heading", () => {
    render(<TestComponent />);

    expect(
      screen.getByRole("heading", { name: "SARVASETU" })
    ).toBeInTheDocument();
  });
});
