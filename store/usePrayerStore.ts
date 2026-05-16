import { create } from "zustand";
import type { PrayerName } from "../constants/prayers";
import { PRAYERS } from "../constants/prayers";
import { getDatabase } from "../database/client";
import * as prayerRepo from "../database/repositories/prayers";
import { computeStreak } from "../utils/streaks";
import { toDateKey } from "../utils/dates";

type PrayerState = {
  prayers: Record<PrayerName, boolean>;
  streak: number;
  weeklyStats: { date: string; percent: number }[];
  loading: boolean;
  hydrate: (date?: string) => Promise<void>;
  toggle: (name: PrayerName, date?: string) => Promise<void>;
};

const emptyPrayers = (): Record<PrayerName, boolean> => {
  const map = {} as Record<PrayerName, boolean>;
  for (const p of PRAYERS) map[p.name] = false;
  return map;
};

export const usePrayerStore = create<PrayerState>((set, get) => ({
  prayers: emptyPrayers(),
  streak: 0,
  weeklyStats: [],
  loading: false,

  hydrate: async (date = toDateKey()) => {
    set({ loading: true });
    try {
      const db = await getDatabase();
      const prayers = await prayerRepo.getPrayersForDate(db, date);
      const full = emptyPrayers();
      for (const p of PRAYERS) {
        full[p.name] = prayers[p.name] ?? false;
      }
      const streakDays = await prayerRepo.getPrayerStreakDays(db);
      const { current } = computeStreak(new Set(streakDays), false);
      const weeklyStats = await prayerRepo.getWeeklyPrayerStats(db);
      set({ prayers: full, streak: current, weeklyStats, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggle: async (name, date = toDateKey()) => {
    const db = await getDatabase();
    const completed = await prayerRepo.togglePrayer(db, date, name);
    const prayers = { ...get().prayers, [name]: completed };
    set({ prayers });
    await get().hydrate(date);
  },
}));
