import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AddCardButton } from "../components/board/AddCardButton";

describe("AddCardButton", () => {
  it("shows add button initially", () => {
    render(<AddCardButton onAdd={() => {}} />);
    expect(screen.getByText("Add a card")).toBeInTheDocument();
  });

  it("shows input after clicking add", async () => {
    render(<AddCardButton onAdd={() => {}} />);
    await userEvent.click(screen.getByText("Add a card"));
    expect(
      screen.getByPlaceholderText("Enter card title..."),
    ).toBeInTheDocument();
  });

  it("calls onAdd with title on submit", async () => {
    const onAdd = vi.fn();
    render(<AddCardButton onAdd={onAdd} />);
    await userEvent.click(screen.getByText("Add a card"));
    await userEvent.type(
      screen.getByPlaceholderText("Enter card title..."),
      "New Task",
    );
    await userEvent.click(screen.getByText("Add"));
    expect(onAdd).toHaveBeenCalledWith("New Task");
  });

  it("cancels without calling onAdd", async () => {
    const onAdd = vi.fn();
    render(<AddCardButton onAdd={onAdd} />);
    await userEvent.click(screen.getByText("Add a card"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText("Add a card")).toBeInTheDocument();
  });
});
