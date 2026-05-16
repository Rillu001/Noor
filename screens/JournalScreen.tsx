import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Plus, Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EmptyState } from "../components/ui/EmptyState";
import { PillButton } from "../components/ui/PillButton";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { colors, radii, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import type { JournalEntry } from "../database/repositories/journal";
import { getJournalEntries } from "../database/repositories/journal";
import type { ReflectStackParamList } from "../navigation/types";
import { format } from "date-fns";

const TAGS = ["all", "gratitude", "dua", "reflection", "goals"] as const;

export function JournalScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ReflectStackParamList>>();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  const load = useCallback(async () => {
    const db = await getDatabase();
    const data = await getJournalEntries(
      db,
      search || undefined,
      activeTag
    );
    setEntries(data);
  }, [search, activeTag]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    load();
  }, [activeTag]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.top}>
        <SectionHeader
          title="Journal"
          subtitle="Private reflections for your soul"
          action={
            <Pressable
              onPress={() => navigation.navigate("JournalEditor", {})}
              style={styles.addBtn}
            >
              <Plus size={22} color={colors.bg.primary} />
            </Pressable>
          }
        />

        <View style={styles.searchWrap}>
          <Search size={18} color={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={colors.text.dim}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={load}
          />
        </View>

        <View style={styles.tags}>
          {TAGS.map((tag) => (
            <PillButton
              key={tag}
              label={tag === "all" ? "All" : tag.charAt(0).toUpperCase() + tag.slice(1)}
              active={activeTag === tag}
              onPress={() => setActiveTag(tag)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="Your journal awaits"
            message="Write your gratitude, duas, and reflections in a peaceful private space."
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("JournalEditor", { entryId: item.id })
            }
            style={styles.entry}
          >
            <Text style={styles.entryTitle}>
              {item.title || "Untitled reflection"}
            </Text>
            <Text style={styles.entryPreview} numberOfLines={2}>
              {item.body}
            </Text>
            <Text style={styles.entryDate}>
              {format(new Date(item.updated_at), "MMM d, yyyy")}
            </Text>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingHorizontal: spacing.md,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glass.fill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: 14,
    marginBottom: spacing.md,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    paddingVertical: 14,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
  },
  entry: {
    backgroundColor: colors.glass.fill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 18,
    marginBottom: 12,
  },
  entryTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  entryPreview: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  entryDate: {
    color: colors.text.dim,
    fontSize: 12,
    marginTop: 10,
  },
});
