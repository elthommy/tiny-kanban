import { useState } from "react";

interface AddCardButtonProps {
  onAdd: (title: string) => void;
}

export function AddCardButton({ onAdd }: AddCardButtonProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setAdding(false);
    }
  };

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="hover:text-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#4c739a] transition-colors hover:bg-white"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Add a card
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") {
            setTitle("");
            setAdding(false);
          }
        }}
        placeholder="Enter card title..."
        className="focus:border-primary mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-primary rounded-lg px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={() => {
            setTitle("");
            setAdding(false);
          }}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#4c739a] hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
