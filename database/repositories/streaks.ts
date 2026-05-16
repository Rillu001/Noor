import type { SQLiteDatabase } from "expo-sqlite";

export async function upsertStreak(
  db: SQLiteDatabase,
  entityType: string,
  entityId: string,
  current: number,
  best: number,
  lastDate: string
): Promise<void> {
  await db.runAsync(
    `INSERT INTO streaks (entity_type, entity_id, current_count, best_count, last_date)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(entity_type, entity_id) DO UPDATE SET
       current_count = excluded.current_count,
       best_count = excluded.best_count,
       last_date = excluded.last_date`,
    [entityType, entityId, current, best, lastDate]
  );
}

export async function getStreak(
  db: SQLiteDatabase,
  entityType: string,
  entityId: string
): Promise<{ current: number; best: number } | null> {
  const row = await db.getFirstAsync<{
    current_count: number;
    best_count: number;
  }>(
    "SELECT current_count, best_count FROM streaks WHERE entity_type = ? AND entity_id = ?",
    [entityType, entityId]
  );
  if (!row) return null;
  return { current: row.current_count, best: row.best_count };
}
