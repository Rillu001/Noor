import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { BRAND_NAME, BRAND_TAGLINE } from "../../constants/brand";
import { colors, spacing } from "../../constants/theme";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  style?: ViewStyle;
};

export function BrandMark({
  size = "md",
  showTagline = false,
  style,
}: BrandMarkProps) {
  const nameStyle =
    size === "lg" ? styles.nameLg : size === "sm" ? styles.nameSm : styles.nameMd;

  return (
    <View style={[styles.wrap, style]}>
      <Text style={nameStyle}>{BRAND_NAME}</Text>
      {showTagline ? (
        <Text style={styles.tagline}>{BRAND_TAGLINE}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-start",
  },
  nameLg: {
    color: colors.text.primary,
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
  },
  nameMd: {
    color: colors.accent.gold,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  nameSm: {
    color: colors.accent.gold,
    fontSize: 20,
    fontWeight: "700",
  },
  tagline: {
    color: colors.accent.gold,
    fontSize: 18,
    fontWeight: "500",
    marginTop: spacing.sm,
  },
});
