import { useCallback, useEffect, useState } from "react";
import {
  fetchColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
} from "../api/columns";
import { createCard, updateCard, archiveCard, moveCard } from "../api/cards";
import type { Column } from "../types";

export function useColumns() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setColumns(await fetchColumns());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addColumn = async (name: string) => {
    await createColumn(name);
    await load();
  };

  const editColumn = async (
    id: string,
    data: { name?: string; is_done_column?: boolean },
  ) => {
    await updateColumn(id, data);
    await load();
  };

  const removeColumn = async (id: string) => {
    await deleteColumn(id);
    await load();
  };

  const reorder = async (columnIds: string[]) => {
    setColumns(await reorderColumns(columnIds));
  };

  const addCard = async (
    columnId: string,
    data: { title: string; description?: string; tag_ids?: string[] },
  ) => {
    await createCard(columnId, data);
    await load();
  };

  const editCard = async (
    id: string,
    data: {
      title?: string;
      description?: string;
      image_url?: string;
      tag_ids?: string[];
    },
  ) => {
    await updateCard(id, data);
    await load();
  };

  const archiveCardById = async (id: string) => {
    await archiveCard(id);
    await load();
  };

  const moveCardTo = async (
    cardId: string,
    targetColumnId: string,
    position: number,
  ) => {
    await moveCard(cardId, targetColumnId, position);
    await load();
  };

  return {
    columns,
    loading,
    reload: load,
    addColumn,
    editColumn,
    removeColumn,
    reorder,
    addCard,
    editCard,
    archiveCardById,
    moveCardTo,
  };
}
