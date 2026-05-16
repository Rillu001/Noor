import { StyleSheet, Text, View } from "react-native";
import { colors, radii } from "../../constants/theme";

type MotivationBannerProps = {
  text: string;
  source?: string | null;
};

export function MotivationBanner({ text, source }: MotivationBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>"{text}"</Text>
      {source ? <Text style={styles.source}>— {source}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "rgba(45, 106, 79, 0.15)",
    borderRadius: radii.md,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 106, 79, 0.3)",
  },
  text: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
  source: {
    color: colors.accent.beige,
    fontSize: 13,
    marginTop: 12,
    fontWeight: "500",
  },
});
