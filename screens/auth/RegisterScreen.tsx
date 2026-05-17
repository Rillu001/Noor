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

export function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout
      title="Create account"
      subtitle="Begin your journey with calm and consistency"
      footer={
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={styles.switchLink}>Sign in</Text>
          </Text>
        </Pressable>
      }
    >
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.text.dim}
          autoComplete="name"
        />
      </View>

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
          placeholder="At least 6 characters"
          placeholderTextColor={colors.text.dim}
          secureTextEntry
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repeat password"
          placeholderTextColor={colors.text.dim}
          secureTextEntry
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={handleRegister}
        style={[styles.submitBtn, loading && styles.submitDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.text.primary} />
        ) : (
          <Text style={styles.submitText}>Create account</Text>
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
    backgroundColor: colors.accent.emerald,
    paddingVertical: 16,
    borderRadius: radii.full,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: colors.text.primary,
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
