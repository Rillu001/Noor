import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { PrayerCard } from "../components/salah/PrayerCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StreakBadge } from "../components/ui/StreakBadge";
import { PRAYERS } from "../constants/prayers";
import { colors, spacing } from "../constants/theme";
import { usePrayerStore } from "../store/usePrayerStore";
import { formatDisplayDate } from "../utils/dates";

const chartWidth = Dimensions.get("window").width - 48;

export function SalahScreen() {
  const { prayers, streak, weeklyStats, hydrate, toggle } = usePrayerStore();

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate])
  );

  const chartData = {
    labels: weeklyStats.map((s) => s.date.slice(8)),
    datasets: [{ data: weeklyStats.map((s) => s.percent / 100 || 0.01) }],
  };

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

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Weekly consistency</Text>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={180}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: colors.bg.primary,
            backgroundGradientFrom: colors.bg.elevated,
            backgroundGradientTo: colors.bg.elevated,
            decimalPlaces: 0,
            color: () => colors.accent.gold,
            labelColor: () => colors.text.muted,
            barPercentage: 0.6,
            propsForBackgroundLines: {
              stroke: colors.glass.border,
            },
          }}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars={false}
        />
      </View>
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
    marginBottom: spacing.xl,
  },
  chartSection: {
    marginTop: spacing.md,
  },
  chartTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: 16,
  },
});
