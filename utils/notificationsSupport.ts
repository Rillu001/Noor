import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

/** True when running inside the Expo Go app (not a dev/production build). */
export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/**
 * Remote/push APIs throw on import in Expo Go on Android (SDK 53+).
 * Local scheduled reminders work in dev builds and store apps.
 */
export function canScheduleLocalNotifications(): boolean {
  if (Platform.OS === "web") {
    return false;
  }
  if (isExpoGo() && Platform.OS === "android") {
    return false;
  }
  return true;
}

export function getNotificationsUnavailableReason(): string | null {
  if (Platform.OS === "web") {
    return "Daily reminders are not available in the web version. Use the mobile app.";
  }
  if (isExpoGo() && Platform.OS === "android") {
    return "Reminders are not available in Expo Go on Android. Install a development build or the store app to enable them.";
  }
  return null;
}
