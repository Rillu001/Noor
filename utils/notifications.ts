import { Platform } from "react-native";
import type { SQLiteDatabase } from "expo-sqlite";
import { getDailyQuote } from "../database/repositories/reminders";
import { canScheduleLocalNotifications } from "./notificationsSupport";

type NotificationsModule = typeof import("expo-notifications");

let notificationsModule: NotificationsModule | null = null;
let loadAttempted = false;
let initPromise: Promise<NotificationsModule | null> | null = null;

async function getNotifications(): Promise<NotificationsModule | null> {
  if (!canScheduleLocalNotifications()) {
    return null;
  }

  if (notificationsModule) {
    return notificationsModule;
  }

  if (loadAttempted && !initPromise) {
    return null;
  }

  if (!initPromise) {
    initPromise = (async () => {
      loadAttempted = true;
      try {
        const Notifications = await import("expo-notifications");
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
        notificationsModule = Notifications;
        return Notifications;
      } catch {
        return null;
      }
    })();
  }

  return initPromise;
}

export {
  canScheduleLocalNotifications,
  getNotificationsUnavailableReason,
  isExpoGo,
} from "./notificationsSupport";

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;

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
  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const quote = await getDailyQuote(db);
  const body =
    quote?.text ?? "Take a gentle moment for your soul today.";

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
  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function configureNotificationChannel(): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications || Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("gentle-reminders", {
    name: "Gentle Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
    lightColor: "#C9A962",
  });
}
