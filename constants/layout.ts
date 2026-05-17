import type { EdgeInsets } from "react-native-safe-area-context";
import { spacing } from "./theme";

/** Visible height of tab icons + labels (excluding safe area). */
export const TAB_BAR_CONTENT_HEIGHT = 56;

/** Extra space so content sits clearly above the bottom tab bar. */
export const TAB_BAR_EXTRA_CLEARANCE = spacing.xl;

/** Extra padding below the status bar (mirrors bottom tab clearance feel). */
export const SCREEN_TOP_EXTRA = spacing.xl;

export function getScreenTopPadding(_insets?: EdgeInsets): number {
  return SCREEN_TOP_EXTRA + spacing.md;
}

export function getTabBarClearance(insets: EdgeInsets): number {
  return (
    TAB_BAR_CONTENT_HEIGHT +
    Math.max(insets.bottom, 12) +
    TAB_BAR_EXTRA_CLEARANCE +
    spacing.lg
  );
}
