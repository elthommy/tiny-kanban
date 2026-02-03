import type { Card } from "../types";

export async function searchCards(q: string): Promise<Card[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}
