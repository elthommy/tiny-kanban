import type { Tag } from "../../types";

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
      style={{
        backgroundColor: tag.bg_color ?? "#3b82f6",
        color: tag.fg_color ?? "#ffffff",
      }}
    >
      {tag.name}
    </span>
  );
}
