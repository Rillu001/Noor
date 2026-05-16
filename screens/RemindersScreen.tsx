import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { GlassCard } from "../components/ui/GlassCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { colors, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import type { ReminderSettings } from "../database/repositories/reminders";
import {
  getReminderSettings,
  updateReminderSettings,
} from "../database/repositories/reminders";
import {
  cancelAllReminders,
  configureNotificationChannel,
  requestNotificationPermissions,
  scheduleDailyReminder,
} from "../utils/notifications";

const HOURS = [6, 7, 8, 9, 12, 18, 20, 21];

export function RemindersScreen() {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);

  const load = useCallback(async () => {
    const db = await getDatabase();
    setSettings(await getReminderSettings(db));
  }, []);

  useFocusEffect(
    useCallback(() => {
      configureNotificationChannel();
      load();
    }, [load])
  );

  async function toggleEnabled(value: boolean) {
    const db = await getDatabase();
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Notifications",
          "Enable notifications in Settings for gentle daily reminders."
        );
        return;
      }
    }
    await updateReminderSettings(db, { enabled: value ? 1 : 0 });
    if (value && settings) {
      await scheduleDailyReminder(db, settings.hour, settings.minute);
    } else {
      await cancelAllReminders();
    }
    load();
  }

  async function setHour(hour: number) {
    const db = await getDatabase();
    await updateReminderSettings(db, { hour });
    const s = await getReminderSettings(db);
    if (s?.enabled) {
      await scheduleDailyReminder(db, hour, s.minute);
    }
    load();
  }

  if (!settings) return null;

  return (
    <ScreenContainer>
      <SectionHeader
        title="Gentle Reminders"
        subtitle="Warm encouragement, never guilt"
      />

      <GlassCard>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Daily reminder</Text>
            <Text style={styles.rowSub}>
              Quran verses, hadith, and peaceful reflections
            </Text>
          </View>
          <Switch
            value={settings.enabled === 1}
            onValueChange={toggleEnabled}
            trackColor={{
              false: colors.glass.border,
              true: colors.accent.emerald,
            }}
            thumbColor={colors.text.primary}
          />
        </View>
      </GlassCard>

      <Text style={styles.sectionLabel}>Reminder time</Text>
      <View style={styles.hours}>
        {HOURS.map((h) => (
          <Pressable
            key={h}
            onPress={() => setHour(h)}
            style={[styles.hourBtn, settings.hour === h && styles.hourActive]}
          >
            <Text
              style={[
                styles.hourText,
                settings.hour === h && styles.hourTextActive,
              ]}
            >
              {formatHour(h)}
            </Text>
          </Pressable>
        ))}
      </View>

      <GlassCard style={styles.noteCard}>
        <Text style={styles.note}>
          Reminders are designed to uplift, not pressure. You can adjust or
          turn them off anytime.
        </Text>
      </GlassCard>
    </ScreenContainer>
  );
}

function formatHour(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:00 ${period}`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  rowTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
  },
  rowSub: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 4,
    maxWidth: 220,
  },
  sectionLabel: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: "600",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  hours: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  hourBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.fill,
  },
  hourActive: {
    borderColor: colors.accent.gold,
    backgroundColor: "rgba(201, 169, 98, 0.15)",
  },
  hourText: {
    color: colors.text.muted,
    fontSize: 14,
  },
  hourTextActive: {
    color: colors.accent.gold,
    fontWeight: "600",
  },
  noteCard: {
    marginTop: spacing.xl,
  },
  note: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
