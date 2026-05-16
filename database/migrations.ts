import type { SQLiteDatabase } from "expo-sqlite";
import { DEFAULT_HABITS } from "../constants/habits";
import remindersSeed from "../constants/seed/reminders.json";
import sunnahSeed from "../constants/seed/sunnah.json";

const SCHEMA_VERSION = 1;

export async function runMigrations(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
  `);

  const row = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM meta WHERE key = 'schema_version'"
  );
  const currentVersion = row ? parseInt(row.value, 10) : 0;

  if (currentVersion < 1) {
    await migrateV1(database);
    await database.runAsync(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)",
      [String(SCHEMA_VERSION)]
    );
  }
}

async function migrateV1(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS prayer_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      prayer_name TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      UNIQUE(date, prayer_name)
    );

    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      icon TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(habit_id, date),
      FOREIGN KEY (habit_id) REFERENCES habits(id)
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      current_count INTEGER NOT NULL DEFAULT 0,
      best_count INTEGER NOT NULL DEFAULT 0,
      last_date TEXT,
      UNIQUE(entity_type, entity_id)
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      mood TEXT,
      tags TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dhikr_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phrase TEXT NOT NULL,
      target_count INTEGER NOT NULL DEFAULT 33,
      current_count INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(phrase, date)
    );

    CREATE TABLE IF NOT EXISTS silent_deeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sunnah_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_year INTEGER NOT NULL,
      title TEXT NOT NULL,
      explanation TEXT NOT NULL,
      practice_tip TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sunnah_reads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sunnah_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      viewed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (sunnah_id) REFERENCES sunnah_items(id)
    );

    CREATE TABLE IF NOT EXISTS reminder_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enabled INTEGER NOT NULL DEFAULT 0,
      hour INTEGER NOT NULL DEFAULT 9,
      minute INTEGER NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'all'
    );

    CREATE TABLE IF NOT EXISTS reminder_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      text TEXT NOT NULL,
      source TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  await seedHabits(database);
  await seedSunnah(database);
  await seedReminders(database);
  await seedReminderSettings(database);
}

async function seedHabits(database: SQLiteDatabase): Promise<void> {
  for (const habit of DEFAULT_HABITS) {
    await database.runAsync(
      `INSERT OR IGNORE INTO habits (slug, title, icon, sort_order, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [habit.slug, habit.title, habit.icon, habit.sortOrder]
    );
  }
}

async function seedSunnah(database: SQLiteDatabase): Promise<void> {
  const count = await database.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) as c FROM sunnah_items"
  );
  if (count && count.c > 0) return;

  for (const item of sunnahSeed) {
    await database.runAsync(
      `INSERT INTO sunnah_items (day_of_year, title, explanation, practice_tip)
       VALUES (?, ?, ?, ?)`,
      [item.day_of_year, item.title, item.explanation, item.practice_tip]
    );
  }
}

async function seedReminders(database: SQLiteDatabase): Promise<void> {
  const count = await database.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) as c FROM reminder_content"
  );
  if (count && count.c > 0) return;

  let order = 0;
  for (const item of remindersSeed) {
    await database.runAsync(
      `INSERT INTO reminder_content (type, text, source, sort_order)
       VALUES (?, ?, ?, ?)`,
      [item.type, item.text, item.source ?? null, order++]
    );
  }
}

async function seedReminderSettings(database: SQLiteDatabase): Promise<void> {
  const count = await database.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) as c FROM reminder_settings"
  );
  if (count && count.c > 0) return;

  await database.runAsync(
    `INSERT INTO reminder_settings (enabled, hour, minute, type) VALUES (0, 9, 0, 'all')`
  );
}
