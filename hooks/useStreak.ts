import { useMemo } from "react";
import { computeStreak } from "../utils/streaks";

export function useStreak(completedDates: string[]) {
  return useMemo(() => {
    const set = new Set(completedDates);
    return computeStreak(set, false);
  }, [completedDates]);
}
