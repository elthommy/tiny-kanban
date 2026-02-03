import { useCallback, useEffect, useState } from "react";
import { fetchArchive, restoreAll, clearArchive } from "../api/archive";
import { restoreCard } from "../api/cards";
import { deleteCard } from "../api/cards";
import type { Card } from "../types";

export function useArchive() {
  const [items, setItems] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchArchive(page, search || undefined);
      setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

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
    loading,
    hasMore: items.length < total,
    searchArchive,
    loadMore,
    restore,
    remove,
    restoreAllCards,
    clearAll,
  };
}
