import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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
    setPhrase,
    setTargetCount,
    hydrate,
    increment,
    reset,
  } = useDhikrStore();

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

  const handleReset = () => {
    Alert.alert(
      "Reset counter",
      "Reset today's count for this dhikr?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => reset() },
      ]
    );
  };

  return (
    <ScreenContainer scroll={false}>
      <SectionHeader
        title="Dhikr Counter"
        subtitle="Tap with presence and peace"
      />

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
              style={[styles.progressFill, { width: `${Math.min(100, progress)}%` }]}
            />
          </View>
          <Text style={styles.tapHint}>Tap to count</Text>
        </AnimatedPressable>
      </View>

      <Text style={styles.phraseDisplay}>{phrase}</Text>

      <Pressable onPress={handleReset} style={styles.resetBtn}>
        <Text style={styles.resetText}>Reset today</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: spacing.xl,
  },
  counterWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    width: 260,
    height: 260,
    borderRadius: 130,
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
    fontSize: 64,
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
    marginTop: 20,
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
    marginTop: 16,
  },
  phraseDisplay: {
    color: colors.accent.beige,
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  resetBtn: {
    alignSelf: "center",
    padding: 12,
  },
  resetText: {
    color: colors.text.muted,
    fontSize: 14,
  },
});
