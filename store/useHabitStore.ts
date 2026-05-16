import { create } from "zustand";
import type { HabitWithStatus } from "../database/repositories/habits";
import { getDatabase } from "../database/client";
import * as habitRepo from "../database/repositories/habits";
import { toDateKey } from "../utils/dates";

type HabitState = {
  habits: HabitWithStatus[];
  streaks: Record<number, number>;
  loading: boolean;
  hydrate: (date?: string) => Promise<void>;
  toggle: (habitId: number, date?: string) => Promise<void>;
  getCompletionPercent: () => number;
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  streaks: {},
  loading: false,

  hydrate: async (date = toDateKey()) => {
    set({ loading: true });
    try {
      const db = await getDatabase();
      const habits = await habitRepo.getHabitsForDate(db, date);
      const streaks: Record<number, number> = {};
      for (const h of habits) {
        streaks[h.id] = await habitRepo.getHabitStreak(db, h.id);
      }
      set({ habits, streaks, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggle: async (habitId, date = toDateKey()) => {
    const db = await getDatabase();
    await habitRepo.toggleHabit(db, habitId, date);
    await get().hydrate(date);
  },

  getCompletionPercent: () => {
    const { habits } = get();
    if (habits.length === 0) return 0;
    const done = habits.filter((h) => h.completed).length;
    return Math.round((done / habits.length) * 100);
  },
}));
