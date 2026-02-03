import type { Card } from "../types";

export async function createCard(
  columnId: string,
  data: { title: string; description?: string; tag_ids?: string[] },
): Promise<Card> {
  const res = await fetch(`/api/columns/${columnId}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create card");
  return res.json();
}

export async function updateCard(
  id: string,
  data: {
    title?: string;
    description?: string;
    image_url?: string;
    tag_ids?: string[];
  },
): Promise<Card> {
  const res = await fetch(`/api/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update card");
  return res.json();
}

export async function deleteCard(id: string): Promise<void> {
  const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete card");
}

export async function moveCard(
  cardId: string,
  targetColumnId: string,
  position: number,
): Promise<Card> {
  const res = await fetch("/api/cards/move", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      card_id: cardId,
      target_column_id: targetColumnId,
      position,
    }),
  });
  if (!res.ok) throw new Error("Failed to move card");
  return res.json();
}

export async function archiveCard(id: string): Promise<Card> {
  const res = await fetch(`/api/cards/${id}/archive`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to archive card");
  return res.json();
}

export async function restoreCard(id: string): Promise<Card> {
  const res = await fetch(`/api/cards/${id}/restore`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to restore card");
  return res.json();
}
