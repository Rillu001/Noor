import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { SQLiteDatabase } from "expo-sqlite";
import { getDailyQuote } from "../database/repositories/reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(
  db: SQLiteDatabase,
  hour: number,
  minute: number
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const quote = await getDailyQuote(db);
  const body =
    quote?.text ??
    "Take a gentle moment for your soul today.";

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Noor",
      body,
      subtitle: quote?.source ?? undefined,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function configureNotificationChannel(): void {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("gentle-reminders", {
      name: "Gentle Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: "#C9A962",
    });
  }
}
