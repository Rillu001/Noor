export type HabitDef = {
  slug: string;
  title: string;
  icon: string;
  sortOrder: number;
};

export const DEFAULT_HABITS: HabitDef[] = [
  { slug: "quran", title: "Quran reading", icon: "book-open", sortOrder: 1 },
  { slug: "dhikr", title: "Dhikr", icon: "heart", sortOrder: 2 },
  { slug: "tahajjud", title: "Tahajjud", icon: "moon", sortOrder: 3 },
  { slug: "sunnah-prayers", title: "Sunnah prayers", icon: "sparkles", sortOrder: 4 },
  { slug: "charity", title: "Charity", icon: "hand-heart", sortOrder: 5 },
  { slug: "fasting", title: "Fasting", icon: "sunrise", sortOrder: 6 },
  { slug: "islamic-study", title: "Islamic study", icon: "graduation-cap", sortOrder: 7 },
  { slug: "morning-adhkar", title: "Morning adhkar", icon: "sun", sortOrder: 8 },
  { slug: "evening-adhkar", title: "Evening adhkar", icon: "sunset", sortOrder: 9 },
];
