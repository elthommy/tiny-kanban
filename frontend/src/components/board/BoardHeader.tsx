import { useState, useEffect } from "react";
import { searchCards } from "../../api/search";
import { getBoardSettings, updateBoardSettings } from "../../api/boardSettings";
import type { Card } from "../../types";

interface BoardHeaderProps {
  onSearchResults: (cards: Card[] | null) => void;
}

export function BoardHeader({ onSearchResults }: BoardHeaderProps) {
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("Development Pipeline");
  const [subtitle, setSubtitle] = useState(
    "Manage your team's current tasks and sprint progress."
  );
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempSubtitle, setTempSubtitle] = useState("");

  useEffect(() => {
    getBoardSettings().then((settings) => {
      setTitle(settings.title);
      setSubtitle(settings.subtitle);
    });
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      onSearchResults(null);
      return;
    }
    const timeout = setTimeout(async () => {
      const results = await searchCards(query);
      onSearchResults(results);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, onSearchResults]);

  const handleTitleEdit = () => {
    setTempTitle(title);
    setEditingTitle(true);
  };

  const handleSubtitleEdit = () => {
    setTempSubtitle(subtitle);
    setEditingSubtitle(true);
  };

  const saveTitleEdit = async () => {
    if (tempTitle.trim()) {
      const updated = await updateBoardSettings({ title: tempTitle });
      setTitle(updated.title);
    }
    setEditingTitle(false);
  };

  const saveSubtitleEdit = async () => {
    if (tempSubtitle.trim()) {
      const updated = await updateBoardSettings({ subtitle: tempSubtitle });
      setSubtitle(updated.subtitle);
    }
    setEditingSubtitle(false);
  };

  const cancelTitleEdit = () => {
    setEditingTitle(false);
    setTempTitle("");
  };

  const cancelSubtitleEdit = () => {
    setEditingSubtitle(false);
    setTempSubtitle("");
  };

  return (
    <div className="flex items-center justify-between px-8 py-6">
      <div className="flex-1">
        {editingTitle ? (
          <div className="flex items-center gap-2">
            <input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitleEdit();
                if (e.key === "Escape") cancelTitleEdit();
              }}
              className="focus:ring-primary/20 text-2xl font-bold text-[#0d141b] rounded-lg border border-slate-200 px-3 py-1 focus:ring-2 focus:outline-none"
              autoFocus
            />
            <button
              onClick={saveTitleEdit}
              className="text-green-600 hover:text-green-700"
            >
              <span className="material-symbols-outlined text-[20px]">
                check
              </span>
            </button>
            <button
              onClick={cancelTitleEdit}
              className="text-red-600 hover:text-red-700"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        ) : (
          <h1
            onClick={handleTitleEdit}
            className="group text-2xl font-bold text-[#0d141b] cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -ml-2 inline-flex items-center gap-2"
          >
            {title}
            <span className="material-symbols-outlined text-[20px] opacity-0 group-hover:opacity-50">
              edit
            </span>
          </h1>
        )}
        {editingSubtitle ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveSubtitleEdit();
                if (e.key === "Escape") cancelSubtitleEdit();
              }}
              className="focus:ring-primary/20 text-sm text-[#4c739a] rounded-lg border border-slate-200 px-3 py-1 focus:ring-2 focus:outline-none"
              autoFocus
            />
            <button
              onClick={saveSubtitleEdit}
              className="text-green-600 hover:text-green-700"
            >
              <span className="material-symbols-outlined text-[16px]">
                check
              </span>
            </button>
            <button
              onClick={cancelSubtitleEdit}
              className="text-red-600 hover:text-red-700"
            >
              <span className="material-symbols-outlined text-[16px]">
                close
              </span>
            </button>
          </div>
        ) : (
          <p
            onClick={handleSubtitleEdit}
            className="group mt-1 text-sm text-[#4c739a] cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -ml-2 inline-flex items-center gap-2"
          >
            {subtitle}
            <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-50">
              edit
            </span>
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[20px] text-[#4c739a]">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="focus:ring-primary/20 w-64 rounded-lg border-none bg-white py-2 pr-4 pl-10 text-sm shadow-sm focus:ring-2 focus:outline-none"
            placeholder="Search tasks..."
          />
        </div>
      </div>
    </div>
  );
}
