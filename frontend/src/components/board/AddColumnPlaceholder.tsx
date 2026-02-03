import { useState } from "react";

interface AddColumnPlaceholderProps {
  onAdd: (name: string) => void;
}

export function AddColumnPlaceholder({ onAdd }: AddColumnPlaceholderProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
      setAdding(false);
    }
  };

  if (adding) {
    return (
      <div className="flex w-[300px] shrink-0 flex-col items-center rounded-xl border-2 border-dashed border-[#cfdbe7] bg-white p-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") {
              setName("");
              setAdding(false);
            }
          }}
          placeholder="Column name..."
          className="focus:border-primary mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-primary rounded-lg px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setName("");
              setAdding(false);
            }}
            className="rounded-lg px-4 py-1.5 text-xs font-semibold text-[#4c739a] hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setAdding(true)}
      className="group flex min-h-[150px] w-[300px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cfdbe7] transition-colors hover:bg-white"
    >
      <span className="material-symbols-outlined group-hover:text-primary text-[32px] text-[#4c739a] transition-colors">
        add
      </span>
      <p className="group-hover:text-primary mt-2 text-sm font-semibold text-[#4c739a] transition-colors">
        Add Section
      </p>
    </button>
  );
}
