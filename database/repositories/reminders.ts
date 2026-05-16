import type { SQLiteDatabase } from "expo-sqlite";
import { getDayOfYearKey } from "../../utils/dates";

export type ReminderContent = {
  id: number;
  type: string;
  text: string;
  source: string | null;
};

export type ReminderSettings = {
  id: number;
  enabled: number;
  hour: number;
  minute: number;
  type: string;
};

export async function getReminderSettings(
  db: SQLiteDatabase
): Promise<ReminderSettings | null> {
  return db.getFirstAsync<ReminderSettings>(
    "SELECT * FROM reminder_settings LIMIT 1"
  );
}

export async function updateReminderSettings(
  db: SQLiteDatabase,
  settings: Partial<Pick<ReminderSettings, "enabled" | "hour" | "minute" | "type">>
): Promise<void> {
  const current = await getReminderSettings(db);
  if (!current) return;

  await db.runAsync(
    `UPDATE reminder_settings SET
      enabled = COALESCE(?, enabled),
      hour = COALESCE(?, hour),
      minute = COALESCE(?, minute),
      type = COALESCE(?, type)
     WHERE id = ?`,
    [
      settings.enabled ?? null,
      settings.hour ?? null,
      settings.minute ?? null,
      settings.type ?? null,
      current.id,
    ]
  );
}

export async function getDailyQuote(
  db: SQLiteDatabase
): Promise<ReminderContent | null> {
  const dayIndex = getDayOfYearKey();
  const items = await db.getAllAsync<ReminderContent>(
    "SELECT * FROM reminder_content ORDER BY sort_order"
  );
  if (items.length === 0) return null;
  return items[(dayIndex - 1) % items.length] ?? items[0];
}

export async function getAllReminderContent(
  db: SQLiteDatabase
): Promise<ReminderContent[]> {
  return db.getAllAsync<ReminderContent>(
    "SELECT * FROM reminder_content ORDER BY sort_order"
  );
}
