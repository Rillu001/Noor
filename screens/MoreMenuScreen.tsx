import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bell, ChevronRight, Eye, TrendingUp } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { colors, radii, spacing } from "../constants/theme";
import type { MoreStackParamList } from "../navigation/types";

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

  return (
    <ScreenContainer>
      <SectionHeader title="More" subtitle="Settings and private tools" />

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

      <View style={styles.footer}>
        <Text style={styles.footerText}>Noor</Text>
        <Text style={styles.footerSub}>Your peaceful companion</Text>
      </View>
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
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
