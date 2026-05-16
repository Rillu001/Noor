import { create } from "zustand";
import { DEFAULT_PHRASES } from "../database/repositories/dhikr";
import { getDatabase } from "../database/client";
import * as dhikrRepo from "../database/repositories/dhikr";
import { toDateKey } from "../utils/dates";

type DhikrState = {
  phrase: string;
  targetCount: number;
  currentCount: number;
  phrases: string[];
  setPhrase: (phrase: string) => void;
  setTargetCount: (count: number) => void;
  hydrate: (date?: string) => Promise<void>;
  increment: (date?: string) => Promise<void>;
  reset: (date?: string) => Promise<void>;
};

export const useDhikrStore = create<DhikrState>((set, get) => ({
  phrase: DEFAULT_PHRASES[0],
  targetCount: 33,
  currentCount: 0,
  phrases: DEFAULT_PHRASES,

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
  },

  increment: async (date = toDateKey()) => {
    const db = await getDatabase();
    const { phrase, targetCount } = get();
    const count = await dhikrRepo.incrementDhikr(db, phrase, date, targetCount);
    set({ currentCount: count });
  },

  reset: async (date = toDateKey()) => {
    const db = await getDatabase();
    const { phrase, targetCount } = get();
    await dhikrRepo.resetDhikrForDate(db, phrase, date, targetCount);
    set({ currentCount: 0 });
  },
}));
