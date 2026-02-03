import { useState, useEffect } from "react";
import { searchCards } from "../../api/search";
import type { Card } from "../../types";

interface BoardHeaderProps {
  onSearchResults: (cards: Card[] | null) => void;
}

export function BoardHeader({ onSearchResults }: BoardHeaderProps) {
  const [query, setQuery] = useState("");

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

  return (
    <div className="flex items-center justify-between px-8 py-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d141b]">
          Development Pipeline
        </h1>
        <p className="mt-1 text-sm text-[#4c739a]">
          Manage your team's current tasks and sprint progress.
        </p>
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
