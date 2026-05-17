import { StyleSheet } from "react-native";
import { colors, radii } from "./theme";

/** Matches Welcome screen: Create account (gold) */
export const authButtons = StyleSheet.create({
  primary: {
    backgroundColor: colors.accent.gold,
    paddingVertical: 16,
    borderRadius: radii.full,
    alignItems: "center",
  },
  primaryText: {
    color: colors.bg.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  /** Matches Welcome screen: Sign in (outlined, white text) */
  secondary: {
    paddingVertical: 16,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: "center",
  },
  secondaryText: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
  },
});
