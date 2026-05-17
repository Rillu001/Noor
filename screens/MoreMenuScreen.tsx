import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bell, ChevronRight, Eye, LogOut, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { colors, radii, spacing } from "../constants/theme";
import type { MoreStackParamList } from "../navigation/types";
import { useAuthStore } from "../store/useAuthStore";

const MENU_ITEMS = [
  {
    screen: "SilentDeeds" as const,
    title: "Silent Deeds",
    subtitle: "Private good deeds tracker",
    icon: Eye,
  },
  {
    screen: "Reminders" as const,
    title: "Gentle Reminders",
    subtitle: "Daily verses and reflections",
    icon: Bell,
  },
  {
    screen: "Insights" as const,
    title: "Weekly Insights",
    subtitle: "Your spiritual progress",
    icon: TrendingUp,
  },
];

export function MoreMenuScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MoreStackParamList>>();
  const logout = useAuthStore((s) => s.logout);
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <ScreenContainer>
      <SectionHeader
        title="More"
        subtitle="Tools and settings"
      />

      {MENU_ITEMS.map((item) => (
        <Pressable
          key={item.screen}
          onPress={() => navigation.navigate(item.screen)}
          style={styles.row}
        >
          <View style={styles.iconWrap}>
            <item.icon size={22} color={colors.accent.gold} />
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <ChevronRight size={20} color={colors.text.dim} />
        </Pressable>
      ))}

      <Pressable
        onPress={() => setLogoutVisible(true)}
        style={[styles.row, styles.logoutRow]}
      >
        <View style={[styles.iconWrap, styles.logoutIconWrap]}>
          <LogOut size={22} color={colors.accent.gold} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>Sign out</Text>
          <Text style={styles.subtitle}>Sign in again anytime</Text>
        </View>
        <ChevronRight size={20} color={colors.text.dim} />
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Noor</Text>
        <Text style={styles.footerSub}>Your peaceful companion</Text>
      </View>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glass.fill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 18,
    marginBottom: 12,
  },
  logoutRow: {
    marginTop: spacing.sm,
    borderColor: "rgba(201, 169, 98, 0.25)",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoutIconWrap: {
    backgroundColor: "rgba(201, 169, 98, 0.18)",
  },
  text: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  footerText: {
    color: colors.accent.gold,
    fontSize: 20,
    fontWeight: "700",
  },
  footerSub: {
    color: colors.text.dim,
    fontSize: 14,
    marginTop: 4,
  },
});
