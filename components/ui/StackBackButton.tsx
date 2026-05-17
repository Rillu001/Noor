import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "../../constants/theme";

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
      style={styles.back}
      hitSlop={8}
    >
      <ChevronLeft size={22} color={colors.accent.gold} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.sm,
    alignSelf: "flex-start",
  },
  label: {
    color: colors.accent.gold,
    fontSize: 16,
    fontWeight: "500",
  },
});
