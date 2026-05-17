import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PrayerCard } from "../components/salah/PrayerCard";
import { GlassCard } from "../components/ui/GlassCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StreakBadge } from "../components/ui/StreakBadge";
import { PRAYERS } from "../constants/prayers";
import { colors, spacing } from "../constants/theme";
import { usePrayerStore } from "../store/usePrayerStore";
import { formatDisplayDate } from "../utils/dates";

const CHART_MAX_PERCENT = 100;

export function SalahScreen() {
  const { prayers, streak, weeklyStats, hydrate, toggle } = usePrayerStore();

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate])
  );

  const completedCount = Object.values(prayers).filter(Boolean).length;

  return (
    <ScreenContainer>
      <Text style={styles.date}>{formatDisplayDate()}</Text>
      <SectionHeader
        title="Daily Salah"
        subtitle={`${completedCount} of 5 prayers completed`}
        action={<StreakBadge count={streak} />}
      />

      <View style={styles.grid}>
        {PRAYERS.map((p) => (
          <PrayerCard
            key={p.name}
            name={p.name}
            label={p.label}
            completed={prayers[p.name]}
            onToggle={() => toggle(p.name)}
          />
        ))}
      </View>

      <GlassCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly consistency</Text>
        <Text style={styles.chartSubtitle}>Each bar = prayers completed that day (out of 5)</Text>
        <View style={styles.weekChart}>
          {weeklyStats.map((day) => (
            <View key={day.date} style={styles.dayCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(
                        day.percent > 0 ? 6 : 0,
                        (day.percent / CHART_MAX_PERCENT) * 100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{day.label}</Text>
              <Text style={styles.dayCount}>
                {day.completed}/5
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  date: {
    color: colors.text.muted,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: spacing.lg,
  },
  chartCard: {
    marginTop: spacing.sm,
  },
  chartTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  chartSubtitle: {
    color: colors.text.dim,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  weekChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 6,
  },
  dayCol: {
    flex: 1,
    alignItems: "center",
  },
  barTrack: {
    width: "100%",
    height: 100,
    backgroundColor: colors.glass.border,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    width: "100%",
    backgroundColor: colors.accent.gold,
    borderRadius: 6,
    minHeight: 0,
  },
  dayLabel: {
    color: colors.text.dim,
    fontSize: 11,
    fontWeight: "500",
  },
  dayCount: {
    color: colors.text.muted,
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },
});
