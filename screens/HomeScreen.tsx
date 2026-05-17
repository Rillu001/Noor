import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BookOpen,
  HandHeart,
  Heart,
  Sparkles,
} from "lucide-react-native";
import { PrayerCard } from "../components/salah/PrayerCard";
import { GlassCard } from "../components/ui/GlassCard";
import { MotivationBanner } from "../components/ui/MotivationBanner";
import { ProgressRing } from "../components/ui/ProgressRing";
import { HomeHeader } from "../components/ui/HomeHeader";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StreakBadge } from "../components/ui/StreakBadge";
import { PRAYERS } from "../constants/prayers";
import { colors, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import type { ReminderContent } from "../database/repositories/reminders";
import { getDailyQuote } from "../database/repositories/reminders";
import type { SunnahItem } from "../database/repositories/sunnah";
import { getTodaySunnah } from "../database/repositories/sunnah";
import type { TabParamList } from "../navigation/types";
import { useHabitStore } from "../store/useHabitStore";
import { usePrayerStore } from "../store/usePrayerStore";

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { prayers, streak, hydrate: hydratePrayers, toggle } = usePrayerStore();
  const { hydrate: hydrateHabits, getCompletionPercent } = useHabitStore();
  const [quote, setQuote] = useState<ReminderContent | null>(null);
  const [sunnah, setSunnah] = useState<SunnahItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      hydratePrayers();
      hydrateHabits();
      loadExtras();
    }, [hydratePrayers, hydrateHabits])
  );

  async function loadExtras() {
    const db = await getDatabase();
    const [q, s] = await Promise.all([
      getDailyQuote(db),
      getTodaySunnah(db),
    ]);
    setQuote(q);
    setSunnah(s);
  }

  const habitPercent = getCompletionPercent();
  const prayerDone = Object.values(prayers).filter(Boolean).length;

  return (
    <ScreenContainer>
      <HomeHeader />

      {quote ? (
        <View style={styles.quoteWrap}>
          <MotivationBanner text={quote.text} source={quote.source} />
        </View>
      ) : null}

      <SectionHeader
        title="Today's Prayers"
        subtitle={`${prayerDone} of 5 complete`}
        action={<StreakBadge count={streak} />}
      />
      <View style={styles.prayerRow}>
        {PRAYERS.map((p) => (
          <PrayerCard
            key={p.name}
            name={p.name}
            label={p.label}
            completed={prayers[p.name]}
            onToggle={() => toggle(p.name)}
            compact
          />
        ))}
      </View>
      <Pressable
        onPress={() => navigation.navigate("Worship", { screen: "Salah" })}
        style={styles.linkWrap}
      >
        <Text style={styles.link}>Open Salah tracker →</Text>
      </Pressable>

      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard}>
          <View style={styles.statVisual}>
            <ProgressRing progress={habitPercent} size={72} />
          </View>
          <Text style={styles.statLabel}>Habits today</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <View style={styles.statVisual}>
            <Text style={styles.streakNumber}>{streak}</Text>
          </View>
          <Text style={styles.statLabel}>Salah streak</Text>
        </GlassCard>
      </View>

      {sunnah ? (
        <Pressable onPress={() => navigation.navigate("Grow", { screen: "Sunnah" })}>
          <GlassCard style={styles.sunnahCard}>
            <Text style={styles.sunnahLabel}>Today's Sunnah</Text>
            <Text style={styles.sunnahTitle}>{sunnah.title}</Text>
          </GlassCard>
        </Pressable>
      ) : null}

      <SectionHeader title="Quick access" />
      <View style={styles.quickGrid}>
        <QuickAction
          icon={Heart}
          label="Dhikr"
          onPress={() =>
            navigation.navigate("Worship", { screen: "Dhikr" })
          }
        />
        <QuickAction
          icon={BookOpen}
          label="Journal"
          onPress={() =>
            navigation.navigate("Reflect", { screen: "Journal" })
          }
        />
        <QuickAction
          icon={HandHeart}
          label="Silent deed"
          onPress={() =>
            navigation.navigate("More", { screen: "SilentDeeds" })
          }
        />
        <QuickAction
          icon={Sparkles}
          label="Habits"
          onPress={() =>
            navigation.navigate("Grow", { screen: "Habits" })
          }
        />
      </View>
    </ScreenContainer>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onPress,
}: {
  icon: typeof Heart;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quickItem}>
      <View style={styles.quickIcon}>
        <Icon size={22} color={colors.accent.gold} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quoteWrap: {
    marginBottom: spacing.lg,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: spacing.sm,
  },
  linkWrap: {
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  link: {
    color: colors.accent.gold,
    fontSize: 15,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minHeight: 148,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  statVisual: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
  streakNumber: {
    color: colors.accent.gold,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
  },
  sunnahCard: {
    marginBottom: spacing.lg,
  },
  sunnahLabel: {
    color: colors.accent.emerald,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sunnahTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickItem: {
    width: "47%",
    backgroundColor: colors.glass.fill,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 20,
    alignItems: "center",
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(201, 169, 98, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
