import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { GlassCard } from "../components/ui/GlassCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { insightTemplates } from "../constants/insights";
import { colors, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import { getTopHabitStreaks } from "../database/repositories/habits";
import { usePrayerStore } from "../store/usePrayerStore";

const chartWidth = Dimensions.get("window").width - 48;

export function InsightsScreen() {
  const { weeklyStats, hydrate } = usePrayerStore();
  const [topHabits, setTopHabits] = useState<{ title: string; streak: number }[]>(
    []
  );

  useFocusEffect(
    useCallback(() => {
      hydrate();
      loadHabits();
    }, [hydrate])
  );

  async function loadHabits() {
    const db = await getDatabase();
    setTopHabits(await getTopHabitStreaks(db));
  }

  const avgPrayer =
    weeklyStats.length > 0
      ? weeklyStats.reduce((a, s) => a + s.percent, 0) / weeklyStats.length
      : 0;

  const summary =
    avgPrayer >= 70
      ? insightTemplates.prayerHigh
      : avgPrayer >= 40
        ? insightTemplates.prayerMid
        : insightTemplates.prayerLow;

  const chartData = {
    labels: weeklyStats.map((s) => s.date.slice(8)),
    datasets: [
      {
        data:
          weeklyStats.length > 0
            ? weeklyStats.map((s) => s.percent)
            : [0, 0, 0, 0, 0, 0, 0],
        color: () => colors.accent.gold,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScreenContainer>
      <SectionHeader
        title="Weekly Insights"
        subtitle="A calm look at your spiritual rhythm"
      />

      <GlassCard style={styles.summaryCard}>
        <Text style={styles.summary}>{summary}</Text>
      </GlassCard>

      <Text style={styles.chartTitle}>Salah consistency</Text>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={200}
        chartConfig={{
          backgroundColor: colors.bg.elevated,
          backgroundGradientFrom: colors.bg.elevated,
          backgroundGradientTo: colors.bg.elevated,
          decimalPlaces: 0,
          color: () => colors.accent.gold,
          labelColor: () => colors.text.muted,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.accent.gold,
          },
        }}
        bezier
        style={styles.chart}
        yAxisSuffix="%"
        fromZero
      />

      <Text style={styles.chartTitle}>Top habit streaks</Text>
      {topHabits.length === 0 ? (
        <Text style={styles.empty}>Start building habits to see streaks here.</Text>
      ) : (
        topHabits.map((h) => (
          <View key={h.title} style={styles.habitRow}>
            <Text style={styles.habitTitle}>{h.title}</Text>
            <Text style={styles.habitStreak}>{h.streak} days</Text>
          </View>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summary: {
    color: colors.text.primary,
    fontSize: 17,
    lineHeight: 26,
    fontStyle: "italic",
  },
  chartTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  habitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  habitTitle: {
    color: colors.text.primary,
    fontSize: 16,
  },
  habitStreak: {
    color: colors.accent.gold,
    fontSize: 15,
    fontWeight: "600",
  },
  empty: {
    color: colors.text.muted,
    fontSize: 15,
  },
});
