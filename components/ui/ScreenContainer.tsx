import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../constants/theme";

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
} & Pick<ScrollViewProps, "refreshControl" | "contentContainerStyle">;

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  contentContainerStyle,
  refreshControl,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const inner = (
    <View
      style={[
        styles.inner,
        padded && styles.padded,
        { paddingTop: spacing.md },
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[colors.bg.primary, "#0F1012", colors.bg.primary]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, contentContainerStyle]}
          refreshControl={refreshControl}
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scroll: {
    paddingBottom: 120,
  },
  inner: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.md,
  },
});
