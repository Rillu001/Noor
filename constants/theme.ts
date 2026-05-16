export const colors = {
  bg: {
    primary: "#0B0C0E",
    elevated: "#14161A",
    card: "rgba(255,255,255,0.04)",
  },
  accent: {
    gold: "#C9A962",
    emerald: "#2D6A4F",
    beige: "#D4C4A8",
    olive: "#6B705C",
  },
  text: {
    primary: "#F5F3EF",
    muted: "#9B9A97",
    dim: "#6B6A67",
  },
  glass: {
    border: "rgba(255,255,255,0.08)",
    fill: "rgba(255,255,255,0.04)",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const navigationTheme = {
  dark: true,
  colors: {
    primary: colors.accent.gold,
    background: colors.bg.primary,
    card: colors.bg.elevated,
    text: colors.text.primary,
    border: colors.glass.border,
    notification: colors.accent.emerald,
  },
  fonts: {
    regular: { fontFamily: "Inter_400Regular", fontWeight: "400" as const },
    medium: { fontFamily: "Inter_500Medium", fontWeight: "500" as const },
    bold: { fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
    heavy: { fontFamily: "Inter_700Bold", fontWeight: "700" as const },
  },
};
