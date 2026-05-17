import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandMark } from "./BrandMark";
import { getScreenTopPadding } from "../../constants/layout";
import { colors, radii, spacing } from "../../constants/theme";

type AuthScreenLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + getScreenTopPadding(insets);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={[colors.bg.primary, "#12141A", "#0B0C0E"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { paddingTop: topPadding }]}>
          <View style={styles.hero}>
            <BrandMark size="md" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.card}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  inner: {
    flex: 1,
  },
  hero: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
});
