import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../constants/theme";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
