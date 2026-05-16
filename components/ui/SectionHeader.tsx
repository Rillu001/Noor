import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../constants/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 14,
    marginTop: 4,
  },
});
