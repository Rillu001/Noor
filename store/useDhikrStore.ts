import { create } from "zustand";
import { DEFAULT_PHRASES } from "../database/repositories/dhikr";
import type { DhikrDayStat } from "../database/repositories/dhikr";
import { getDatabase } from "../database/client";
import * as dhikrRepo from "../database/repositories/dhikr";
import { toDateKey } from "../utils/dates";

type DhikrState = {
  phrase: string;
  targetCount: number;
  currentCount: number;
  phrases: string[];
  weekTotal: number;
  allTimeTotal: number;
  weeklyStats: DhikrDayStat[];
  setPhrase: (phrase: string) => void;
  setTargetCount: (count: number) => void;
  hydrate: (date?: string) => Promise<void>;
  hydrateStats: () => Promise<void>;
  increment: (date?: string) => Promise<void>;
  resetToday: (date?: string) => Promise<void>;
  resetAllHistory: () => Promise<void>;
};

export const useDhikrStore = create<DhikrState>((set, get) => ({
  phrase: DEFAULT_PHRASES[0],
  targetCount: 33,
  currentCount: 0,
  phrases: DEFAULT_PHRASES,
  weekTotal: 0,
  allTimeTotal: 0,
  weeklyStats: [],

  setPhrase: (phrase) => {
    set({ phrase });
    get().hydrate();
  },

  setTargetCount: async (count) => {
    set({ targetCount: count });
    const db = await getDatabase();
    const { phrase, currentCount } = get();
    await dhikrRepo.upsertDhikrSession(
      db,
      phrase,
      toDateKey(),
      count,
      currentCount
    );
  },

  hydrate: async (date = toDateKey()) => {
    const db = await getDatabase();
    const { phrase, targetCount } = get();
    const session = await dhikrRepo.getDhikrSession(db, phrase, date);
    set({
      currentCount: session?.current_count ?? 0,
      targetCount: session?.target_count ?? targetCount,
    });
    await get().hydrateStats();
  },

  hydrateStats: async () => {
    const db = await getDatabase();
    const [weeklyStats, weekTotal, allTimeTotal] = await Promise.all([
      dhikrRepo.getDhikrWeeklyStats(db),
      dhikrRepo.getDhikrWeekTotal(db),
      dhikrRepo.getDhikrAllTimeTotal(db),
    ]);
    set({ weeklyStats, weekTotal, allTimeTotal });
  },

  increment: async (date = toDateKey()) => {
    const db = await getDatabase();
    const { phrase, targetCount } = get();
    const count = await dhikrRepo.incrementDhikr(db, phrase, date, targetCount);
    set({ currentCount: count });
    await get().hydrateStats();
  },

  resetToday: async (date = toDateKey()) => {
    const db = await getDatabase();
    const { phrase, targetCount } = get();
    await dhikrRepo.resetDhikrForDate(db, phrase, date, targetCount);
    set({ currentCount: 0 });
    await get().hydrateStats();
  },

  resetAllHistory: async () => {
    const db = await getDatabase();
    await dhikrRepo.clearAllDhikrHistory(db);
    set({
      currentCount: 0,
      weekTotal: 0,
      allTimeTotal: 0,
      weeklyStats: get().weeklyStats.map((day) => ({ ...day, total: 0 })),
    });
    await get().hydrateStats();
    await get().hydrate();
  },
}));
