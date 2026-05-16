export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export const PRAYERS: { name: PrayerName; label: string; short: string }[] = [
  { name: "Fajr", label: "Fajr", short: "F" },
  { name: "Dhuhr", label: "Dhuhr", short: "D" },
  { name: "Asr", label: "Asr", short: "A" },
  { name: "Maghrib", label: "Maghrib", short: "M" },
  { name: "Isha", label: "Isha", short: "I" },
];
