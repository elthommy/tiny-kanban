import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Column, Tag } from "../../types";
import { ColumnHeader } from "./ColumnHeader";
import { KanbanCard } from "./KanbanCard";
import { AddCardButton } from "./AddCardButton";

interface KanbanColumnProps {
  column: Column;
  allTags: Tag[];
  onRename: (name: string) => void;
  onToggleDone: () => void;
  onDelete: () => void;
  onAddCard: (title: string) => void;
  onArchiveCard: (cardId: string) => void;
  onEditCard: (cardId: string) => void;
}

export function KanbanColumn({
  column,
  allTags,
  onRename,
  onToggleDone,
  onDelete,
  onAddCard,
  onArchiveCard,
  onEditCard,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    data: { type: "column", column },
  });

  const cardIds = column.cards.map((c) => c.id);

  return (
    <div className="flex max-h-full w-[350px] flex-col rounded-xl bg-[#ebedef]">
      <ColumnHeader
        column={column}
        onRename={onRename}
        onToggleDone={onToggleDone}
        onDelete={onDelete}
        onAddCard={() => onAddCard("")}
      />
      <div
        ref={setNodeRef}
        className="custom-scrollbar flex flex-col gap-4 overflow-y-auto p-4 pt-0"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              isDoneColumn={column.is_done_column}
              allTags={allTags}
              onArchive={() => onArchiveCard(card.id)}
              onEdit={() => onEditCard(card.id)}
            />
          ))}
        </SortableContext>
        <AddCardButton onAdd={onAddCard} />
      </div>
    </div>
  );
}
