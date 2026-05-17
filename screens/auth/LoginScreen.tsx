import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthScreenLayout } from "../../components/ui/AuthScreenLayout";
import { authButtons } from "../../constants/authButtons";
import { colors, radii, spacing } from "../../constants/theme";
import type { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/useAuthStore";

export function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout
      title="Welcome back"
      subtitle="Sign in to continue your journey with sincerity"
      footer={
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.switchText}>
            New here? <Text style={styles.switchLink}>Create account</Text>
          </Text>
        </Pressable>
      }
    >
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.text.dim}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor={colors.text.dim}
          secureTextEntry
          autoComplete="password"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={handleLogin}
        style={[
          styles.submitBtn,
          styles.submitBtnFirst,
          loading && styles.submitDisabled,
        ]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.bg.primary} />
        ) : (
          <Text style={styles.submitText}>Sign in</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Welcome")}
        style={[authButtons.secondary, styles.backBtn]}
      >
        <Text style={authButtons.secondaryText}>Back</Text>
      </Pressable>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.glass.fill,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: radii.md,
    color: colors.text.primary,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    color: colors.accent.beige,
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: colors.accent.gold,
    paddingVertical: 16,
    borderRadius: radii.full,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitBtnFirst: {
    marginTop: spacing.xs,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: colors.bg.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  backBtn: {
    marginTop: spacing.sm,
  },
  switchText: {
    color: colors.text.muted,
    fontSize: 15,
    textAlign: "center",
  },
  switchLink: {
    color: colors.accent.gold,
    fontWeight: "600",
  },
});
