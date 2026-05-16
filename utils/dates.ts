import { format, getDayOfYear, subDays } from "date-fns";

export function toDateKey(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function getDayOfYearKey(date: Date = new Date()): number {
  return getDayOfYear(date);
}

export function getLastNDays(n: number): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    keys.push(toDateKey(subDays(new Date(), i)));
  }
  return keys;
}

export function formatDisplayDate(date: Date = new Date()): string {
  return format(date, "EEEE, MMMM d");
}

export function getGreeting(): string {
  return "Assalamu Alaikum";
}
