import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../../constants/theme";

type StackBackButtonProps = {
  label?: string;
  onPress?: () => void;
};

export function StackBackButton({
  label = "Back",
  onPress,
}: StackBackButtonProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={onPress ?? (() => navigation.goBack())}
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.chevronWrap}>
        <ChevronLeft
          size={20}
          color={colors.accent.gold}
          strokeWidth={2.5}
        />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    alignSelf: "flex-start",
    flexShrink: 0,
    marginBottom: spacing.lg,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 16,
    borderRadius: radii.full,
    backgroundColor: "rgba(201, 169, 98, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(201, 169, 98, 0.28)",
    maxWidth: "100%",
  },
  pillPressed: {
    opacity: 0.8,
    backgroundColor: "rgba(201, 169, 98, 0.16)",
  },
  chevronWrap: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  label: {
    color: colors.accent.gold,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    includeFontPadding: false,
    flexShrink: 0,
  },
});
