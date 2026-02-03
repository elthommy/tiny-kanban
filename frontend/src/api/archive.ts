import type { ArchivePage, Card } from "../types";

export async function fetchArchive(
  page: number = 1,
  q?: string,
): Promise<ArchivePage> {
  const params = new URLSearchParams({ page: String(page) });
  if (q) params.set("q", q);
  const res = await fetch(`/api/archive?${params}`);
  if (!res.ok) throw new Error("Failed to fetch archive");
  return res.json();
}

export async function restoreAll(): Promise<Card[]> {
  const res = await fetch("/api/archive/restore-all", { method: "POST" });
  if (!res.ok) throw new Error("Failed to restore all");
  return res.json();
}

export async function clearArchive(): Promise<void> {
  const res = await fetch("/api/archive/clear", { method: "POST" });
  if (!res.ok) throw new Error("Failed to clear archive");
}
