import { useState } from "react";
import type { Column } from "../../types";

interface ColumnHeaderProps {
  column: Column;
  onRename: (name: string) => void;
  onToggleDone: () => void;
  onDelete: () => void;
  onAddCard: () => void;
}

export function ColumnHeader({
  column,
  onRename,
  onToggleDone,
  onDelete,
  onAddCard,
}: ColumnHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const [menuOpen, setMenuOpen] = useState(false);

  const cardCount = column.cards.length;

  const countColor = column.is_done_column
    ? "bg-green-100 text-green-600"
    : column.position === 1
      ? "bg-primary/20 text-primary"
      : "bg-slate-200 text-[#4c739a]";

  const handleRename = () => {
    if (name.trim() && name !== column.name) {
      onRename(name.trim());
    }
    setEditing(false);
  };

  return (
    <div className="sticky top-0 flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setName(column.name);
                setEditing(false);
              }
            }}
            className="border-primary/30 rounded border bg-transparent px-1 text-base font-bold text-[#0d141b] focus:outline-none"
          />
        ) : (
          <h3
            className="cursor-pointer text-base font-bold text-[#0d141b]"
            onDoubleClick={() => setEditing(true)}
          >
            {column.name}
          </h3>
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${countColor}`}
        >
          {cardCount}
        </span>
      </div>
      <div className="relative flex items-center gap-1">
        <button
          onClick={onAddCard}
          className="hover:text-primary text-[#4c739a] transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:text-primary text-[#4c739a] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            more_vert
          </span>
        </button>
        {menuOpen && (
          <div className="absolute top-8 right-0 z-20 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setEditing(true);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#0d141b] hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
              Rename
            </button>
            <button
              onClick={() => {
                onToggleDone();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#0d141b] hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {column.is_done_column ? "remove_done" : "done_all"}
              </span>
              {column.is_done_column ? "Unmark as Done" : "Mark as Done"}
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
              Delete Column
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
