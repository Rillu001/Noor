import type { SQLiteDatabase } from "expo-sqlite";

export type SilentDeed = {
  id: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
};

export const DEED_CATEGORIES = [
  "Helped someone",
  "Charity",
  "Dua for others",
  "Kindness",
  "Forgiveness",
  "Other",
] as const;

export async function getSilentDeeds(db: SQLiteDatabase): Promise<SilentDeed[]> {
  return db.getAllAsync<SilentDeed>(
    "SELECT * FROM silent_deeds ORDER BY created_at DESC"
  );
}

export async function addSilentDeed(
  db: SQLiteDatabase,
  category: string,
  note: string | null,
  date: string
): Promise<void> {
  await db.runAsync(
    `INSERT INTO silent_deeds (category, note, date, created_at) VALUES (?, ?, ?, ?)`,
    [category, note, date, new Date().toISOString()]
  );
}

export async function deleteSilentDeed(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM silent_deeds WHERE id = ?", [id]);
}
