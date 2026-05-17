import { format, parseISO } from "date-fns";
import type { SQLiteDatabase } from "expo-sqlite";
import { getLastNDays } from "../../utils/dates";

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

/** Removes all saved counts for a phrase across every day. */
export async function clearDhikrPhraseHistory(
  db: SQLiteDatabase,
  phrase: string
): Promise<void> {
  await db.runAsync("DELETE FROM dhikr_sessions WHERE phrase = ?", [phrase]);
}

/** Removes every dhikr session (all phrases and dates). */
export async function clearAllDhikrHistory(
  db: SQLiteDatabase
): Promise<void> {
  await db.runAsync("DELETE FROM dhikr_sessions");
}

export type DhikrDayStat = {
  date: string;
  label: string;
  total: number;
};

export async function getDhikrWeeklyStats(
  db: SQLiteDatabase
): Promise<DhikrDayStat[]> {
  const days = getLastNDays(7);
  const stats: DhikrDayStat[] = [];

  for (const date of days) {
    const row = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(current_count), 0) as total
       FROM dhikr_sessions WHERE date = ?`,
      [date]
    );
    let label = date;
    try {
      label = format(parseISO(date), "EEE");
    } catch {
      // keep date key as label
    }
    stats.push({
      date,
      label,
      total: row?.total ?? 0,
    });
  }

  return stats;
}

export async function getDhikrWeekTotal(db: SQLiteDatabase): Promise<number> {
  const days = getLastNDays(7);
  if (days.length === 0) return 0;
  const placeholders = days.map(() => "?").join(", ");
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(current_count), 0) as total
     FROM dhikr_sessions WHERE date IN (${placeholders})`,
    days
  );
  return row?.total ?? 0;
}

export async function getDhikrAllTimeTotal(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(current_count), 0) as total FROM dhikr_sessions`
  );
  return row?.total ?? 0;
}
