import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { PrayerName } from "../../constants/prayers";
import { colors, radii } from "../../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PrayerCardProps = {
  name: PrayerName;
  label: string;
  completed: boolean;
  onToggle: () => void;
  compact?: boolean;
};

export function PrayerCard({
  name,
  label,
  completed,
  onToggle,
  compact = false,
}: PrayerCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  if (compact) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        style={[styles.compact, completed && styles.compactDone, animatedStyle]}
      >
        <Text style={[styles.compactText, completed && styles.compactTextDone]}>
          {label.slice(0, 1)}
        </Text>
        {completed ? <Check size={10} color={colors.bg.primary} /> : null}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.card, completed && styles.cardDone, animatedStyle]}
    >
      <View style={[styles.circle, completed && styles.circleDone]}>
        {completed ? <Check size={22} color={colors.bg.primary} /> : null}
      </View>
      <Text style={[styles.label, completed && styles.labelDone]}>{label}</Text>
      <Text style={styles.sublabel}>{name}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.glass.fill,
    borderWidth: 1,
    borderColor: colors.glass.border,
    minWidth: 100,
  },
  cardDone: {
    borderColor: "rgba(201, 169, 98, 0.4)",
    backgroundColor: "rgba(201, 169, 98, 0.08)",
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.glass.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  circleDone: {
    backgroundColor: colors.accent.gold,
    borderColor: colors.accent.gold,
  },
  label: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  labelDone: {
    color: colors.accent.gold,
  },
  sublabel: {
    color: colors.text.dim,
    fontSize: 11,
    marginTop: 2,
  },
  compact: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glass.fill,
  },
  compactDone: {
    backgroundColor: colors.accent.gold,
    borderColor: colors.accent.gold,
  },
  compactText: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  compactTextDone: {
    color: colors.bg.primary,
  },
});
