import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../../constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
};

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  label,
  color = colors.accent.gold,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(100, Math.max(0, progress)), {
      duration: 600,
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      circumference - (circumference * animatedProgress.value) / 100,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.glass.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.labelWrap}>
        {label ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          <Text style={styles.percent}>{Math.round(progress)}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  percent: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
});
