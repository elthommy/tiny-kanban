import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TagBadge } from "../components/shared/TagBadge";

describe("TagBadge", () => {
  it("renders tag name", () => {
    render(
      <TagBadge tag={{ id: "1", name: "Bug", color: "red", created_at: "" }} />,
    );
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("applies correct color classes for known colors", () => {
    const { container } = render(
      <TagBadge
        tag={{ id: "1", name: "Feature", color: "green", created_at: "" }}
      />,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-600");
  });

  it("falls back to blue for unknown colors", () => {
    const { container } = render(
      <TagBadge
        tag={{ id: "1", name: "Other", color: "magenta", created_at: "" }}
      />,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-blue-100");
  });
});
