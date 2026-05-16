import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii } from "../../constants/theme";

type PillButtonProps = {
  label: string;
  onPress: () => void;
  active?: boolean;
  variant?: "gold" | "emerald" | "ghost";
};

export function PillButton({
  label,
  onPress,
  active = false,
  variant = "ghost",
}: PillButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        variant === "gold" && styles.gold,
        variant === "emerald" && styles.emerald,
        active && styles.active,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.textActive,
          variant === "gold" && styles.goldText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.fill,
  },
  active: {
    borderColor: colors.accent.gold,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
  },
  gold: {
    backgroundColor: colors.accent.gold,
    borderColor: colors.accent.gold,
  },
  emerald: {
    backgroundColor: colors.accent.emerald,
    borderColor: colors.accent.emerald,
  },
  text: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: "500",
  },
  textActive: {
    color: colors.accent.gold,
  },
  goldText: {
    color: colors.bg.primary,
    fontWeight: "600",
  },
});
