import type { SQLiteDatabase } from "expo-sqlite";
import { getDayOfYearKey } from "../../utils/dates";
import sunnahSeed from "../../constants/seed/sunnah.json";

export type SunnahItem = {
  id: number;
  day_of_year: number;
  title: string;
  explanation: string;
  practice_tip: string;
};

export async function getTodaySunnah(
  db: SQLiteDatabase
): Promise<SunnahItem | null> {
  const dayOfYear = getDayOfYearKey();
  const seedCount = sunnahSeed.length;

  let item = await db.getFirstAsync<SunnahItem>(
    "SELECT * FROM sunnah_items WHERE day_of_year = ?",
    [dayOfYear]
  );

  if (!item && seedCount > 0) {
    const mappedDay = ((dayOfYear - 1) % seedCount) + 1;
    item = await db.getFirstAsync<SunnahItem>(
      "SELECT * FROM sunnah_items WHERE day_of_year = ?",
      [mappedDay]
    );
  }

  return item;
}

export async function markSunnahViewed(
  db: SQLiteDatabase,
  sunnahId: number,
  date: string
): Promise<void> {
  await db.runAsync(
    `INSERT INTO sunnah_reads (sunnah_id, date, viewed) VALUES (?, ?, 1)`,
    [sunnahId, date]
  );
}
