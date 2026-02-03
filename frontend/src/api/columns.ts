import type { Column } from "../types";

export async function fetchColumns(): Promise<Column[]> {
  const res = await fetch("/api/columns");
  if (!res.ok) throw new Error("Failed to fetch columns");
  return res.json();
}

export async function createColumn(name: string): Promise<Column> {
  const res = await fetch("/api/columns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create column");
  return res.json();
}

export async function updateColumn(
  id: string,
  data: { name?: string; is_done_column?: boolean },
): Promise<Column> {
  const res = await fetch(`/api/columns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update column");
  return res.json();
}

export async function deleteColumn(id: string): Promise<void> {
  const res = await fetch(`/api/columns/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete column");
}

export async function reorderColumns(columnIds: string[]): Promise<Column[]> {
  const res = await fetch("/api/columns/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ column_ids: columnIds }),
  });
  if (!res.ok) throw new Error("Failed to reorder columns");
  return res.json();
}
