import { useState } from "react";
import { useColumns } from "../hooks/useColumns";
import { useTags } from "../hooks/useTags";
import { BoardContent } from "../components/board/BoardContent";
import { CardEditModal } from "../components/shared/CardEditModal";
import { ConfirmDialog } from "../components/shared/ConfirmDialog";
import { deleteCard } from "../api/cards";
import type { Card } from "../types";

export function BoardPage() {
  const {
    columns,
    loading,
    addColumn,
    editColumn,
    removeColumn,
    addCard,
    editCard,
    archiveCardById,
    moveCardTo,
    reload,
  } = useColumns();
  const { tags } = useTags();

  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleEditCard = (cardId: string) => {
    const card = columns.flatMap((c) => c.cards).find((c) => c.id === cardId);
    if (card) setEditingCard(card);
  };

  const handleAddCard = (columnId: string, title: string) => {
    if (title) {
      addCard(columnId, { title });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[#4c739a]">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <BoardContent
        columns={columns}
        allTags={tags}
        onAddColumn={addColumn}
        onRenameColumn={(id, name) => editColumn(id, { name })}
        onToggleDoneColumn={(id, isDone) =>
          editColumn(id, { is_done_column: isDone })
        }
        onDeleteColumn={removeColumn}
        onAddCard={handleAddCard}
        onArchiveCard={archiveCardById}
        onEditCard={handleEditCard}
        onMoveCard={moveCardTo}
      />

      {editingCard && (
        <CardEditModal
          card={editingCard}
          allTags={tags}
          onSave={async (data) => {
            await editCard(editingCard.id, data);
            setEditingCard(null);
          }}
          onDelete={() => {
            setConfirmDelete(editingCard.id);
            setEditingCard(null);
          }}
          onClose={() => setEditingCard(null)}
        />
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete Card"
        message="This will permanently delete this card. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (confirmDelete) {
            await deleteCard(confirmDelete);
            await reload();
          }
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
