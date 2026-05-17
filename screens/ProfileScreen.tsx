import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GlassCard } from "../components/ui/GlassCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StackBackButton } from "../components/ui/StackBackButton";
import { colors, radii, spacing } from "../constants/theme";
import { useAuthStore } from "../store/useAuthStore";

export function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);

  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleSaveProfile() {
    setProfileError(null);
    setProfileMessage(null);
    setSavingProfile(true);
    try {
      await updateProfile(name);
      setProfileMessage("Profile updated.");
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError(null);
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password updated.");
    } catch (e) {
      setPasswordError(
        e instanceof Error ? e.message : "Could not change password."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <ScreenContainer>
      <StackBackButton onPress={() => navigation.goBack()} />

      <SectionHeader
        title="Profile"
        subtitle="Update your account details"
      />

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Personal details</Text>

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
            style={[styles.input, styles.inputDisabled]}
            value={user?.email ?? ""}
            editable={false}
          />
          <Text style={styles.hint}>Email cannot be changed on this device.</Text>
        </View>

        {profileError ? <Text style={styles.error}>{profileError}</Text> : null}
        {profileMessage ? (
          <Text style={styles.success}>{profileMessage}</Text>
        ) : null}

        <Pressable
          onPress={handleSaveProfile}
          style={[styles.primaryBtn, savingProfile && styles.btnDisabled]}
          disabled={savingProfile}
        >
          {savingProfile ? (
            <ActivityIndicator color={colors.bg.primary} />
          ) : (
            <Text style={styles.primaryBtnText}>Save profile</Text>
          )}
        </Pressable>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Change password</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Current password</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor={colors.text.dim}
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.text.dim}
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat new password"
            placeholderTextColor={colors.text.dim}
            secureTextEntry
          />
        </View>

        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
        {passwordMessage ? (
          <Text style={styles.success}>{passwordMessage}</Text>
        ) : null}

        <Pressable
          onPress={handleChangePassword}
          style={[styles.secondaryBtn, savingPassword && styles.btnDisabled]}
          disabled={savingPassword}
        >
          {savingPassword ? (
            <ActivityIndicator color={colors.accent.gold} />
          ) : (
            <Text style={styles.secondaryBtnText}>Update password</Text>
          )}
        </Pressable>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
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
  inputDisabled: {
    opacity: 0.7,
  },
  hint: {
    color: colors.text.dim,
    fontSize: 12,
    marginTop: 6,
  },
  error: {
    color: colors.accent.beige,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  success: {
    color: colors.accent.emerald,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.accent.emerald,
    paddingVertical: 14,
    borderRadius: radii.full,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: radii.full,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.accent.gold,
    backgroundColor: "rgba(201, 169, 98, 0.1)",
    marginTop: spacing.xs,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtnText: {
    color: colors.accent.gold,
    fontSize: 16,
    fontWeight: "600",
  },
});
