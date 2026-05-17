import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../components/ui/GlassCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StackBackButton } from "../components/ui/StackBackButton";
import type { GrowStackParamList } from "../navigation/types";
import { colors, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import type { SunnahItem } from "../database/repositories/sunnah";
import { getTodaySunnah, markSunnahViewed } from "../database/repositories/sunnah";
import { toDateKey } from "../utils/dates";

export function SunnahScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<GrowStackParamList>>();
  const [item, setItem] = useState<SunnahItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSunnah();
    }, [])
  );

  async function loadSunnah() {
    const db = await getDatabase();
    const sunnah = await getTodaySunnah(db);
    setItem(sunnah);
    if (sunnah) {
      await markSunnahViewed(db, sunnah.id, toDateKey());
    }
  }

  function goBackToGrow() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Habits");
    }
  }

  if (!item) {
    return (
      <ScreenContainer>
        <StackBackButton label="Grow" onPress={goBackToGrow} />
        <SectionHeader title="Today's Sunnah" />
        <Text style={styles.loading}>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StackBackButton label="Grow" onPress={goBackToGrow} />
      <SectionHeader
        title="Today's Sunnah"
        subtitle="A small step toward the Prophetic way"
      />

      <GlassCard>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>Understanding</Text>
        <Text style={styles.body}>{item.explanation}</Text>
        <Text style={[styles.sectionLabel, styles.practiceLabel]}>
          How to practice
        </Text>
        <Text style={styles.practice}>{item.practice_tip}</Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    color: colors.text.muted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glass.border,
    marginVertical: spacing.lg,
  },
  sectionLabel: {
    color: colors.accent.gold,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  practiceLabel: {
    marginTop: spacing.lg,
  },
  body: {
    color: colors.text.muted,
    fontSize: 16,
    lineHeight: 26,
  },
  practice: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 26,
    fontStyle: "italic",
  },
});
