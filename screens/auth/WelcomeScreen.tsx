import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandMark } from "../../components/ui/BrandMark";
import { getScreenTopPadding } from "../../constants/layout";
import { authButtons } from "../../constants/authButtons";
import { colors, spacing } from "../../constants/theme";
import type { AuthStackParamList } from "../../navigation/types";

export function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.root, { paddingTop: insets.top + getScreenTopPadding(insets) }]}
    >
      <LinearGradient
        colors={[colors.bg.primary, "#12141A", colors.bg.primary]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <BrandMark size="lg" showTagline />
        <Text style={styles.description}>
          Track salah, dhikr, habits, and private reflections — with calm and
          sincerity.
        </Text>
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={authButtons.primary}
        >
          <Text style={authButtons.primaryText}>Create account</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={authButtons.secondary}
        >
          <Text style={authButtons.secondaryText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  description: {
    color: colors.text.muted,
    fontSize: 16,
    lineHeight: 26,
    marginTop: spacing.lg,
    maxWidth: 320,
  },
  actions: {
    gap: 12,
  },
});
