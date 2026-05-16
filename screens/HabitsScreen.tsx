import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HabitRow } from "../components/habits/HabitRow";
import { GlassCard } from "../components/ui/GlassCard";
import { ProgressRing } from "../components/ui/ProgressRing";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { colors, spacing } from "../constants/theme";
import type { GrowStackParamList } from "../navigation/types";
import { useHabitStore } from "../store/useHabitStore";

export function HabitsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<GrowStackParamList>>();
  const { habits, streaks, hydrate, toggle, getCompletionPercent } =
    useHabitStore();

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate])
  );

  const percent = getCompletionPercent();
  const completed = habits.filter((h) => h.completed).length;
  const insight =
    completed === 0
      ? "Begin with one small act of goodness today."
      : completed === habits.length
        ? "Beautiful — you nurtured every habit today."
        : `${completed} habits completed — keep your rhythm.`;

  return (
    <ScreenContainer>
      <SectionHeader
        title="Islamic Habits"
        subtitle="Build consistency with sincerity"
      />

      <View style={styles.headerCard}>
        <ProgressRing progress={percent} size={100} />
        <View style={styles.headerText}>
          <Text style={styles.percentLabel}>{percent}%</Text>
          <Text style={styles.insight}>{insight}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate("Sunnah")}
        style={styles.sunnahLink}
      >
        <GlassCard>
          <Text style={styles.sunnahTitle}>Today's Sunnah</Text>
          <Text style={styles.sunnahSub}>Tap to read and reflect</Text>
        </GlassCard>
      </Pressable>

      <View style={styles.list}>
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            streak={streaks[habit.id] ?? 0}
            onToggle={() => toggle(habit.id)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.glass.fill,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  headerText: {
    flex: 1,
  },
  percentLabel: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  insight: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sunnahLink: {
    marginBottom: spacing.lg,
  },
  sunnahTitle: {
    color: colors.accent.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  sunnahSub: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 4,
  },
  list: {
    marginTop: spacing.sm,
  },
});
