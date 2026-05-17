import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { GlassCard } from "../components/ui/GlassCard";
import { PillButton } from "../components/ui/PillButton";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { colors, radii, spacing } from "../constants/theme";
import { useDhikrStore } from "../store/useDhikrStore";

const GOALS = [33, 99, 100];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DhikrScreen() {
  const {
    phrase,
    phrases,
    targetCount,
    currentCount,
    weekTotal,
    allTimeTotal,
    weeklyStats,
    setPhrase,
    setTargetCount,
    hydrate,
    increment,
    reset,
  } = useDhikrStore();

  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const scale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate, phrase])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progress = targetCount > 0 ? (currentCount / targetCount) * 100 : 0;
  const weekMax = Math.max(...weeklyStats.map((d) => d.total), 1);

  const handleTap = async () => {
    scale.value = withSpring(0.92, { damping: 12 }, () => {
      scale.value = withSpring(1);
    });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await increment();
    if (currentCount + 1 === targetCount) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }
  };

  const handleResetConfirm = async () => {
    setResetDialogVisible(false);
    await reset();
  };

  return (
    <ScreenContainer>
      <SectionHeader
        title="Dhikr Counter"
        subtitle="Tap with presence and peace"
      />

      <GlassCard style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{currentCount}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{weekTotal}</Text>
            <Text style={styles.statLabel}>This week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{allTimeTotal}</Text>
            <Text style={styles.statLabel}>All time</Text>
          </View>
        </View>

        <Text style={styles.weekTitle}>Last 7 days</Text>
        <View style={styles.weekChart}>
          {weeklyStats.map((day) => (
            <View key={day.date} style={styles.dayCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(8, (day.total / weekMax) * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{day.label}</Text>
              <Text style={styles.dayCount}>{day.total}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.phraseScroll}
        contentContainerStyle={styles.phraseRow}
      >
        {phrases.map((p) => (
          <PillButton
            key={p}
            label={p}
            active={phrase === p}
            onPress={() => setPhrase(p)}
          />
        ))}
      </ScrollView>

      <View style={styles.goalRow}>
        {GOALS.map((g) => (
          <PillButton
            key={g}
            label={String(g)}
            active={targetCount === g}
            onPress={() => setTargetCount(g)}
          />
        ))}
      </View>

      <View style={styles.counterWrap}>
        <AnimatedPressable
          onPress={handleTap}
          style={[styles.counter, animatedStyle]}
        >
          <Text style={styles.count}>{currentCount}</Text>
          <Text style={styles.target}>/ {targetCount}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, progress)}%` },
              ]}
            />
          </View>
          <Text style={styles.tapHint}>Tap to count</Text>
        </AnimatedPressable>
      </View>

      <Text style={styles.phraseDisplay}>{phrase}</Text>

      <Pressable
        onPress={() => setResetDialogVisible(true)}
        style={styles.resetBtn}
      >
        <Text style={styles.resetText}>Reset today</Text>
      </Pressable>

      <ConfirmDialog
        visible={resetDialogVisible}
        title="Reset counter"
        message={`Reset today's count for "${phrase}"? This cannot be undone.`}
        confirmLabel="Reset"
        cancelLabel="Keep count"
        variant="destructive"
        onConfirm={handleResetConfirm}
        onCancel={() => setResetDialogVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.glass.border,
    marginVertical: 4,
  },
  statValue: {
    color: colors.accent.gold,
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  weekTitle: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: spacing.sm,
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
    height: 56,
    backgroundColor: colors.glass.border,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    width: "100%",
    backgroundColor: colors.accent.emerald,
    borderRadius: 6,
    minHeight: 4,
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
  },
  phraseScroll: {
    maxHeight: 50,
    marginBottom: spacing.md,
  },
  phraseRow: {
    gap: 8,
    paddingRight: spacing.md,
  },
  goalRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.md,
  },
  counterWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  counter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.glass.fill,
    borderWidth: 2,
    borderColor: "rgba(201, 169, 98, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
  },
  count: {
    color: colors.text.primary,
    fontSize: 56,
    fontWeight: "300",
    letterSpacing: -2,
  },
  target: {
    color: colors.text.muted,
    fontSize: 18,
    marginTop: 4,
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: colors.glass.border,
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent.gold,
    borderRadius: 2,
  },
  tapHint: {
    color: colors.text.dim,
    fontSize: 13,
    marginTop: 12,
  },
  phraseDisplay: {
    color: colors.accent.beige,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  resetBtn: {
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.accent.gold,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
    marginBottom: spacing.sm,
  },
  resetText: {
    color: colors.accent.gold,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
