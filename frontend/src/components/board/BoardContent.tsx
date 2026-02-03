import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { Column, Card, Tag } from "../../types";
import { KanbanColumn } from "./KanbanColumn";
import { AddColumnPlaceholder } from "./AddColumnPlaceholder";
import { BoardHeader } from "./BoardHeader";
import { TagBadge } from "../shared/TagBadge";

interface BoardContentProps {
  columns: Column[];
  allTags: Tag[];
  onAddColumn: (name: string) => void;
  onRenameColumn: (id: string, name: string) => void;
  onToggleDoneColumn: (id: string, isDone: boolean) => void;
  onDeleteColumn: (id: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onArchiveCard: (cardId: string) => void;
  onEditCard: (cardId: string) => void;
  onMoveCard: (
    cardId: string,
    targetColumnId: string,
    position: number,
  ) => void;
}

export function BoardContent({
  columns,
  allTags,
  onAddColumn,
  onRenameColumn,
  onToggleDoneColumn,
  onDeleteColumn,
  onAddCard,
  onArchiveCard,
  onEditCard,
  onMoveCard,
}: BoardContentProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [searchResults, setSearchResults] = useState<Card[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleSearchResults = useCallback((results: Card[] | null) => {
    setSearchResults(results);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = active.data.current?.card as Card | undefined;
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const overData = over.data.current;

    let targetColumnId: string;
    let position: number;

    if (overData?.type === "column") {
      targetColumnId = overData.column.id;
      position = overData.column.cards.length;
    } else if (overData?.type === "card") {
      const overCard = overData.card as Card;
      targetColumnId = overCard.column_id!;
      position = overCard.position;
    } else {
      // Dropped on a droppable column zone
      const overId = over.id as string;
      if (overId.startsWith("column-")) {
        targetColumnId = overId.replace("column-", "");
        const col = columns.find((c) => c.id === targetColumnId);
        position = col?.cards.length ?? 0;
      } else {
        return;
      }
    }

    onMoveCard(cardId, targetColumnId, position);
  };

  // Filter columns based on search
  const displayColumns =
    searchResults !== null
      ? columns.map((col) => ({
          ...col,
          cards: col.cards.filter((c) =>
            searchResults.some((r) => r.id === c.id),
          ),
        }))
      : columns;

  return (
    <>
      <BoardHeader onSearchResults={handleSearchResults} />
      <div className="custom-scrollbar flex-1 overflow-x-auto p-8 pt-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full min-w-max items-start gap-6 pb-4">
            {displayColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                allTags={allTags}
                onRename={(name) => onRenameColumn(column.id, name)}
                onToggleDone={() =>
                  onToggleDoneColumn(column.id, !column.is_done_column)
                }
                onDelete={() => onDeleteColumn(column.id)}
                onAddCard={(title) => onAddCard(column.id, title)}
                onArchiveCard={onArchiveCard}
                onEditCard={onEditCard}
              />
            ))}
            <AddColumnPlaceholder onAdd={onAddColumn} />
          </div>
          <DragOverlay>
            {activeCard && (
              <div className="border-primary/30 w-[320px] rotate-3 rounded-xl border bg-white p-4 opacity-90 shadow-lg">
                {activeCard.tags.length > 0 && (
                  <div className="mb-2 flex gap-2">
                    {activeCard.tags.map((tag) => (
                      <TagBadge key={tag.id} tag={tag} />
                    ))}
                  </div>
                )}
                <p className="text-base font-bold text-[#0d141b]">
                  {activeCard.title}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
