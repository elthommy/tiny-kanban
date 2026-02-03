import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Sidebar } from "../components/layout/Sidebar";

describe("Sidebar", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
    expect(screen.getByText("Current Board")).toBeInTheDocument();
    expect(screen.getByText("Archived Tasks")).toBeInTheDocument();
  });

  it("highlights active link", () => {
    render(
      <MemoryRouter initialEntries={["/archive"]}>
        <Sidebar />
      </MemoryRouter>,
    );
    const archiveLink = screen.getByText("Archived Tasks").closest("a");
    expect(archiveLink?.className).toContain("text-primary");
  });
});
