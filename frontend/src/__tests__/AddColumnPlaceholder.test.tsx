import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AddColumnPlaceholder } from "../components/board/AddColumnPlaceholder";

describe("AddColumnPlaceholder", () => {
  it("shows placeholder initially", () => {
    render(<AddColumnPlaceholder onAdd={() => {}} />);
    expect(screen.getByText("Add Section")).toBeInTheDocument();
  });

  it("shows input after clicking", async () => {
    render(<AddColumnPlaceholder onAdd={() => {}} />);
    await userEvent.click(screen.getByText("Add Section"));
    expect(screen.getByPlaceholderText("Column name...")).toBeInTheDocument();
  });

  it("calls onAdd with name on submit", async () => {
    const onAdd = vi.fn();
    render(<AddColumnPlaceholder onAdd={onAdd} />);
    await userEvent.click(screen.getByText("Add Section"));
    await userEvent.type(
      screen.getByPlaceholderText("Column name..."),
      "Review",
    );
    await userEvent.click(screen.getByText("Add"));
    expect(onAdd).toHaveBeenCalledWith("Review");
  });
});
