import type { BoardSettings } from "../types";

const API_BASE = "http://localhost:8000/api";

export async function getBoardSettings(): Promise<BoardSettings> {
  const res = await fetch(`${API_BASE}/board-settings`);
  if (!res.ok) throw new Error("Failed to fetch board settings");
  return res.json();
}

export async function updateBoardSettings(data: {
  title?: string;
  subtitle?: string;
}): Promise<BoardSettings> {
  const res = await fetch(`${API_BASE}/board-settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update board settings");
  return res.json();
}
