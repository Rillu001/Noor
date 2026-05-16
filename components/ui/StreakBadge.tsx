import { Flame } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii } from "../../constants/theme";

type StreakBadgeProps = {
  count: number;
  label?: string;
};

export function StreakBadge({ count, label = "day streak" }: StreakBadgeProps) {
  if (count <= 0) return null;
  return (
    <View style={styles.badge}>
      <Flame size={14} color={colors.accent.gold} />
      <Text style={styles.text}>
        {count} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: "rgba(201, 169, 98, 0.25)",
  },
  text: {
    color: colors.accent.gold,
    fontSize: 13,
    fontWeight: "600",
  },
});
