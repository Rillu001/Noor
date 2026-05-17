import { format, parseISO } from "date-fns";
import type { SQLiteDatabase } from "expo-sqlite";
import type { PrayerName } from "../../constants/prayers";
import { getLastNDays, toDateKey } from "../../utils/dates";

export type PrayerDayStat = {
  date: string;
  label: string;
  percent: number;
  completed: number;
};

export type PrayerLog = {
  prayer_name: PrayerName;
  completed: number;
};

export async function getPrayersForDate(
  db: SQLiteDatabase,
  date: string
): Promise<Record<PrayerName, boolean>> {
  const rows = await db.getAllAsync<{ prayer_name: PrayerName; completed: number }>(
    "SELECT prayer_name, completed FROM prayer_logs WHERE date = ?",
    [date]
  );
  const map = {} as Record<PrayerName, boolean>;
  for (const row of rows) {
    map[row.prayer_name] = row.completed === 1;
  }
  return map;
}

export async function togglePrayer(
  db: SQLiteDatabase,
  date: string,
  prayerName: PrayerName
): Promise<boolean> {
  const existing = await db.getFirstAsync<{ completed: number }>(
    "SELECT completed FROM prayer_logs WHERE date = ? AND prayer_name = ?",
    [date, prayerName]
  );
  const newCompleted = existing ? (existing.completed === 1 ? 0 : 1) : 1;
  const completedAt = newCompleted === 1 ? new Date().toISOString() : null;

  await db.runAsync(
    `INSERT INTO prayer_logs (date, prayer_name, completed, completed_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(date, prayer_name) DO UPDATE SET
       completed = excluded.completed,
       completed_at = excluded.completed_at`,
    [date, prayerName, newCompleted, completedAt]
  );
  return newCompleted === 1;
}

export async function getWeeklyPrayerStats(
  db: SQLiteDatabase
): Promise<PrayerDayStat[]> {
  const days = getLastNDays(7);
  const stats: PrayerDayStat[] = [];

  for (const date of days) {
    const row = await db.getFirstAsync<{ done: number }>(
      `SELECT COALESCE(SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END), 0) as done
       FROM prayer_logs WHERE date = ?`,
      [date]
    );
    const completed = Number(row?.done ?? 0);
    const percent = Math.round((completed / 5) * 100);
    let label = date;
    try {
      label = format(parseISO(date), "EEE");
    } catch {
      // keep date key as label
    }
    stats.push({ date, label, percent, completed });
  }
  return stats;
}

export async function getPrayerStreakDays(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ date: string; done: number }>(`
    SELECT date, SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as done
    FROM prayer_logs
    GROUP BY date
    HAVING done >= 5
    ORDER BY date DESC
  `);
  return rows.map((r) => r.date);
}

export async function getTodayCompletedCount(
  db: SQLiteDatabase,
  date: string = toDateKey()
): Promise<number> {
  const row = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) as c FROM prayer_logs WHERE date = ? AND completed = 1`,
    [date]
  );
  return row?.c ?? 0;
}
