import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { User } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ConfirmDialog } from "./ConfirmDialog";
import { UserMenuModal } from "./UserMenuModal";
import { colors, spacing } from "../../constants/theme";
import type { TabParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/useAuthStore";
import { formatDisplayDate, getGreeting } from "../../utils/dates";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function HomeHeader() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const displayName = user?.name ?? "Guest";

  return (
    <View style={styles.header}>
      <View style={styles.textCol}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.userName} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.date}>{formatDisplayDate()}</Text>
      </View>

      <Pressable
        onPress={() => setMenuVisible(true)}
        style={({ pressed }) => [styles.avatarBtn, pressed && styles.avatarPressed]}
        accessibilityLabel="Account menu"
        accessibilityRole="button"
      >
        <View style={styles.avatarRing}>
          {user ? (
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          ) : (
            <User size={20} color={colors.accent.gold} strokeWidth={2} />
          )}
        </View>
      </Pressable>

      <UserMenuModal
        visible={menuVisible}
        userName={displayName}
        onClose={() => setMenuVisible(false)}
        onProfile={() => {
          setMenuVisible(false);
          navigation.navigate("More", { screen: "Profile" });
        }}
        onLogout={() => {
          setMenuVisible(false);
          setLogoutVisible(true);
        }}
      />

      <ConfirmDialog
        visible={logoutVisible}
        title="Sign out"
        message="You will need to sign in again to access your account."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        variant="destructive"
        onConfirm={async () => {
          setLogoutVisible(false);
          await logout();
        }}
        onCancel={() => setLogoutVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  textCol: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  greeting: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginTop: 2,
    lineHeight: 28,
  },
  date: {
    color: colors.text.dim,
    fontSize: 13,
    marginTop: 4,
  },
  avatarBtn: {
    flexShrink: 0,
  },
  avatarPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1.5,
    borderColor: colors.accent.gold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: colors.accent.gold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
