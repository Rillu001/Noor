import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radii } from "../../constants/theme";

type GlassCardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
};

export function GlassCard({ children, onPress, style }: GlassCardProps) {
  const content = (
    <View style={[styles.wrapper, style]}>
      <BlurView intensity={24} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  blur: {
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
