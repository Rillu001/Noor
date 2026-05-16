import type { SQLiteDatabase } from "expo-sqlite";

export type JournalEntry = {
  id: number;
  title: string;
  body: string;
  mood: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
};

export async function getJournalEntries(
  db: SQLiteDatabase,
  search?: string,
  tag?: string
): Promise<JournalEntry[]> {
  let query = "SELECT * FROM journal_entries";
  const params: string[] = [];
  const conditions: string[] = [];

  if (search) {
    conditions.push("(title LIKE ? OR body LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (tag && tag !== "all") {
    conditions.push("tags LIKE ?");
    params.push(`%${tag}%`);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY updated_at DESC";

  return db.getAllAsync<JournalEntry>(query, params);
}

export async function getJournalEntry(
  db: SQLiteDatabase,
  id: number
): Promise<JournalEntry | null> {
  return db.getFirstAsync<JournalEntry>(
    "SELECT * FROM journal_entries WHERE id = ?",
    [id]
  );
}

export async function saveJournalEntry(
  db: SQLiteDatabase,
  entry: {
    id?: number;
    title: string;
    body: string;
    tags: string;
    mood?: string;
  }
): Promise<number> {
  const now = new Date().toISOString();
  if (entry.id) {
    await db.runAsync(
      `UPDATE journal_entries SET title = ?, body = ?, tags = ?, mood = ?, updated_at = ? WHERE id = ?`,
      [entry.title, entry.body, entry.tags, entry.mood ?? null, now, entry.id]
    );
    return entry.id;
  }
  const result = await db.runAsync(
    `INSERT INTO journal_entries (title, body, tags, mood, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [entry.title, entry.body, entry.tags, entry.mood ?? null, now, now]
  );
  return result.lastInsertRowId;
}

export async function deleteJournalEntry(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM journal_entries WHERE id = ?", [id]);
}
