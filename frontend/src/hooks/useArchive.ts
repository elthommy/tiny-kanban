import { useCallback, useEffect, useState } from "react";
import { fetchArchive, restoreAll, clearArchive } from "../api/archive";
import { restoreCard } from "../api/cards";
import { deleteCard } from "../api/cards";
import type { Card } from "../types";

type ArchiveMode = "all" | "recent";

export function useArchive(mode: ArchiveMode = "all") {
  const [items, setItems] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const RECENT_LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const recentLimit = mode === "recent" ? RECENT_LIMIT : undefined;
      const data = await fetchArchive(page, search || undefined, recentLimit);
      setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
      setTotal(data.total);

      // For recent mode, the count is the number of items returned (up to limit)
      if (mode === "recent") {
        setRecentCount(data.items.length);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, mode]);

  useEffect(() => {
    // Reset page when mode changes
    setPage(1);
    setItems([]);
  }, [mode]);

  useEffect(() => {
    load();
  }, [load]);

  const searchArchive = (q: string) => {
    setPage(1);
    setItems([]);
    setSearch(q);
  };

  const loadMore = () => {
    setPage((p) => p + 1);
  };

  const restore = async (id: string) => {
    await restoreCard(id);
    setPage(1);
    setItems([]);
    await load();
  };

  const remove = async (id: string) => {
    await deleteCard(id);
    setPage(1);
    setItems([]);
    await load();
  };

  const restoreAllCards = async () => {
    await restoreAll();
    setItems([]);
    setTotal(0);
  };

  const clearAll = async () => {
    await clearArchive();
    setItems([]);
    setTotal(0);
  };

  return {
    items,
    total,
    recentCount,
    loading,
    hasMore: mode === "all" && items.length < total,
    searchArchive,
    loadMore,
    restore,
    remove,
    restoreAllCards,
    clearAll,
  };
}
