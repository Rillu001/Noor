# Sakeena

A modern, peaceful Islamic habit tracker and self-improvement companion for Muslims. Built with Expo React Native.

## Features (MVP)

- **Daily Salah tracker** — Fajr through Isha with streaks and weekly charts
- **Islamic habit tracker** — Quran, dhikr, tahajjud, charity, and more
- **Today's Sunnah** — Daily prophetic practice with gentle guidance
- **Dhikr counter** — Elegant tasbeeh with haptics and goals
- **Islamic journal** — Private gratitude, duas, and reflections
- **Silent deeds** — Hidden good deeds tracker (no sharing)
- **Gentle reminders** — Uplifting verses and hadith notifications
- **Weekly insights** — Calm progress overview

## Tech stack

- Expo SDK 54 + TypeScript
- NativeWind (Tailwind)
- SQLite (offline-first)
- Zustand
- React Navigation
- Reanimated + Gesture Handler
- Expo Notifications

## Getting started

```bash
cd ~/Documents/sakeena
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## Project structure

```
components/   UI and feature components
screens/      Screen views
navigation/   Tab and stack navigators
database/     SQLite client, migrations, repositories
store/        Zustand state
constants/    Theme, habits, seed content
utils/        Dates, streaks, notifications
services/sync/ Future cloud sync adapters (stubs)
```

## Future architecture

The app is designed for future expansion:

- **Cloud sync** — Implement `ISyncProvider` (Firebase or Supabase) in `services/sync/`
- **Ramadan mode** — Flag in `useAppStore`
- **Multilingual** — `constants/i18n.ts` placeholder
- **Widgets & wearables** — Documented extension points

## Offline-first

All data is stored locally in SQLite. No network required for MVP.

## License

Private — All rights reserved.
