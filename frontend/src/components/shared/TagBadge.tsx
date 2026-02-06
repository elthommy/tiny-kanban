import type { Tag } from "../../types";

const colorMap: Record<string, string> = {
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-purple-100 text-purple-600",
  slate: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-100 text-emerald-600",
  pink: "bg-pink-100 text-pink-600",
  orange: "bg-orange-100 text-orange-600",
};

export function TagBadge({ tag }: { tag: Tag }) {
  // Use custom colors if available, otherwise fall back to predefined colors
  if (tag.bg_color && tag.fg_color) {
    return (
      <span
        className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
        style={{
          backgroundColor: tag.bg_color,
          color: tag.fg_color,
        }}
      >
        {tag.name}
      </span>
    );
  }

  const colors = colorMap[tag.color] ?? colorMap.blue;
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${colors}`}
    >
      {tag.name}
    </span>
  );
}
