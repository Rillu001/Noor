import type { SQLiteDatabase } from "expo-sqlite";

export type DhikrSession = {
  id: number;
  phrase: string;
  target_count: number;
  current_count: number;
  date: string;
};

export const DEFAULT_PHRASES = [
  "SubhanAllah",
  "Alhamdulillah",
  "Allahu Akbar",
  "La ilaha illallah",
];

export async function getDhikrSession(
  db: SQLiteDatabase,
  phrase: string,
  date: string
): Promise<DhikrSession | null> {
  return db.getFirstAsync<DhikrSession>(
    "SELECT * FROM dhikr_sessions WHERE phrase = ? AND date = ?",
    [phrase, date]
  );
}

export async function upsertDhikrSession(
  db: SQLiteDatabase,
  phrase: string,
  date: string,
  targetCount: number,
  currentCount: number
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO dhikr_sessions (phrase, target_count, current_count, date, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(phrase, date) DO UPDATE SET
       target_count = excluded.target_count,
       current_count = excluded.current_count,
       updated_at = excluded.updated_at`,
    [phrase, targetCount, currentCount, date, now]
  );
}

export async function incrementDhikr(
  db: SQLiteDatabase,
  phrase: string,
  date: string,
  targetCount: number
): Promise<number> {
  const session = await getDhikrSession(db, phrase, date);
  const newCount = (session?.current_count ?? 0) + 1;
  await upsertDhikrSession(db, phrase, date, targetCount, newCount);
  return newCount;
}

export async function resetDhikrForDate(
  db: SQLiteDatabase,
  phrase: string,
  date: string,
  targetCount: number
): Promise<void> {
  await upsertDhikrSession(db, phrase, date, targetCount, 0);
}
