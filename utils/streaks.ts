import { subDays } from "date-fns";
import { toDateKey } from "./dates";

export function computeStreak(
  completedDates: Set<string>,
  requiresAll: boolean,
  dailyCheck?: (dateKey: string) => boolean
): { current: number; best: number } {
  let current = 0;
  let best = 0;
  let run = 0;

  const checkDay = (dateKey: string) => {
    if (dailyCheck) return dailyCheck(dateKey);
    return completedDates.has(dateKey);
  };

  // Walk backward from today
  let d = new Date();
  while (true) {
    const key = toDateKey(d);
    if (checkDay(key)) {
      current++;
      d = subDays(d, 1);
    } else {
      break;
    }
  }

  // Compute best streak from sorted dates
  const sorted = [...completedDates].sort();
  for (const dateKey of sorted) {
    if (checkDay(dateKey)) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }
  best = Math.max(best, current);

  return { current, best };
}

export function allPrayersComplete(
  completedPrayers: string[],
  total: number = 5
): boolean {
  return completedPrayers.length >= total;
}
