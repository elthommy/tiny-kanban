import { useState } from "react";

interface TagCreateDialogProps {
  onSave: (data: { name: string; bg_color: string; fg_color: string }) => void;
  onClose: () => void;
}

export function TagCreateDialog({ onSave, onClose }: TagCreateDialogProps) {
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState("#93c5fd");
  const [fgColor, setFgColor] = useState("#1e3a8a");

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), bg_color: bgColor, fg_color: fgColor });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0d141b]">Create New Tag</h3>
          <button
            onClick={onClose}
            className="text-[#4c739a] hover:text-[#0d141b]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0d141b]">
              Tag Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Priority, Bug Fix..."
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0d141b]">
              Preview
            </label>
            <div className="flex items-center justify-center rounded-lg bg-slate-50 py-4">
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                style={{
                  backgroundColor: bgColor,
                  color: fgColor,
                }}
              >
                {name || "TAG PREVIEW"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#0d141b]">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded border border-slate-200"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#0d141b]">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded border border-slate-200"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#4c739a] hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-primary rounded-lg px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Tag
          </button>
        </div>
      </div>
    </div>
  );
}
