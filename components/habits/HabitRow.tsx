import * as Haptics from "expo-haptics";
import {
  BookOpen,
  GraduationCap,
  HandHeart,
  Heart,
  Moon,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { HabitWithStatus } from "../../database/repositories/habits";
import { colors, radii } from "../../constants/theme";
import { StreakBadge } from "../ui/StreakBadge";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  heart: Heart,
  moon: Moon,
  sparkles: Sparkles,
  "hand-heart": HandHeart,
  sunrise: Sunrise,
  "graduation-cap": GraduationCap,
  sun: Sun,
  sunset: Sunset,
};

type HabitRowProps = {
  habit: HabitWithStatus;
  streak: number;
  onToggle: () => void;
};

export function HabitRow({ habit, streak, onToggle }: HabitRowProps) {
  const Icon = iconMap[habit.icon] ?? Heart;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.row, habit.completed && styles.rowDone]}
    >
      <View style={[styles.iconWrap, habit.completed && styles.iconWrapDone]}>
        <Icon
          size={20}
          color={habit.completed ? colors.bg.primary : colors.accent.gold}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, habit.completed && styles.titleDone]}>
          {habit.title}
        </Text>
        {streak > 0 ? <StreakBadge count={streak} /> : null}
      </View>
      <View style={[styles.check, habit.completed && styles.checkDone]}>
        {habit.completed ? (
          <Text style={styles.checkMark}>✓</Text>
        ) : (
          <View style={styles.checkEmpty} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.glass.fill,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: 10,
  },
  rowDone: {
    borderColor: "rgba(45, 106, 79, 0.35)",
    backgroundColor: "rgba(45, 106, 79, 0.1)",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconWrapDone: {
    backgroundColor: colors.accent.emerald,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  titleDone: {
    color: colors.accent.beige,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.glass.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: {
    backgroundColor: colors.accent.emerald,
    borderColor: colors.accent.emerald,
  },
  checkMark: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  checkEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
});
