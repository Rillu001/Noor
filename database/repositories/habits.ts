import type { SQLiteDatabase } from "expo-sqlite";

export type Habit = {
  id: number;
  slug: string;
  title: string;
  icon: string;
  sort_order: number;
};

export type HabitWithStatus = Habit & { completed: boolean };

export async function getActiveHabits(db: SQLiteDatabase): Promise<Habit[]> {
  return db.getAllAsync<Habit>(
    "SELECT id, slug, title, icon, sort_order FROM habits WHERE is_active = 1 ORDER BY sort_order"
  );
}

export async function getHabitsForDate(
  db: SQLiteDatabase,
  date: string
): Promise<HabitWithStatus[]> {
  const habits = await getActiveHabits(db);
  const result: HabitWithStatus[] = [];

  for (const habit of habits) {
    const log = await db.getFirstAsync<{ completed: number }>(
      "SELECT completed FROM habit_logs WHERE habit_id = ? AND date = ?",
      [habit.id, date]
    );
    result.push({
      ...habit,
      completed: log?.completed === 1,
    });
  }
  return result;
}

export async function toggleHabit(
  db: SQLiteDatabase,
  habitId: number,
  date: string
): Promise<boolean> {
  const existing = await db.getFirstAsync<{ completed: number }>(
    "SELECT completed FROM habit_logs WHERE habit_id = ? AND date = ?",
    [habitId, date]
  );
  const newCompleted = existing ? (existing.completed === 1 ? 0 : 1) : 1;

  await db.runAsync(
    `INSERT INTO habit_logs (habit_id, date, completed)
     VALUES (?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET completed = excluded.completed`,
    [habitId, date, newCompleted]
  );
  return newCompleted === 1;
}

export async function getHabitStreak(
  db: SQLiteDatabase,
  habitId: number
): Promise<number> {
  const rows = await db.getAllAsync<{ date: string }>(
    `SELECT date FROM habit_logs WHERE habit_id = ? AND completed = 1 ORDER BY date DESC`,
    [habitId]
  );
  if (rows.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < rows.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedKey = expected.toISOString().slice(0, 10);
    if (rows[i]?.date === expectedKey) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getTopHabitStreaks(
  db: SQLiteDatabase,
  limit = 3
): Promise<{ title: string; streak: number }[]> {
  const habits = await getActiveHabits(db);
  const streaks: { title: string; streak: number }[] = [];

  for (const habit of habits) {
    const streak = await getHabitStreak(db, habit.id);
    if (streak > 0) streaks.push({ title: habit.title, streak });
  }

  return streaks.sort((a, b) => b.streak - a.streak).slice(0, limit);
}
