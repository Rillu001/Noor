import { create } from "zustand";
import { toDateKey } from "../utils/dates";

type AppState = {
  dbReady: boolean;
  onboardingComplete: boolean;
  selectedDate: string;
  ramadanModeEnabled: boolean;
  setDbReady: (ready: boolean) => void;
  setSelectedDate: (date: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  dbReady: false,
  onboardingComplete: true,
  selectedDate: toDateKey(),
  ramadanModeEnabled: false,
  setDbReady: (ready) => set({ dbReady: ready }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
