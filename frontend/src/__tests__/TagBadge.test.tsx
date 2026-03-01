import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TagBadge } from "../components/shared/TagBadge";

describe("TagBadge", () => {
  it("renders tag name", () => {
    render(
      <TagBadge
        tag={{ id: "1", name: "Bug", bg_color: "#ef4444", fg_color: "#ffffff", created_at: "" }}
      />,
    );
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("applies inline styles from bg_color and fg_color", () => {
    const { container } = render(
      <TagBadge
        tag={{ id: "1", name: "Feature", bg_color: "#22c55e", fg_color: "#000000", created_at: "" }}
      />,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.style.backgroundColor).toBe("rgb(34, 197, 94)");
    expect(badge.style.color).toBe("rgb(0, 0, 0)");
  });

  it("falls back to blue when bg_color is missing", () => {
    const { container } = render(
      <TagBadge
        tag={{ id: "1", name: "Other", bg_color: undefined as unknown as string, fg_color: undefined as unknown as string, created_at: "" }}
      />,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.style.backgroundColor).toBe("rgb(59, 130, 246)");
  });
});
