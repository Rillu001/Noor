import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Plus, Trash2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { PillButton } from "../components/ui/PillButton";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StackBackButton } from "../components/ui/StackBackButton";
import { getTabBarClearance } from "../constants/layout";
import { colors, radii, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import {
  addSilentDeed,
  DEED_CATEGORIES,
  deleteSilentDeed,
  getSilentDeeds,
  type SilentDeed,
} from "../database/repositories/deeds";
import type { MoreStackParamList } from "../navigation/types";
import { toDateKey } from "../utils/dates";
import { format, parseISO } from "date-fns";

export function SilentDeedsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MoreStackParamList>>();
  const insets = useSafeAreaInsets();
  const listBottomPadding = getTabBarClearance(insets);
  const [deeds, setDeeds] = useState<SilentDeed[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState<string>(DEED_CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    category: string;
  } | null>(null);

  const load = useCallback(async () => {
    const db = await getDatabase();
    setDeeds(await getSilentDeeds(db));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const sections = groupByDate(deeds);

  async function handleAdd() {
    const db = await getDatabase();
    await addSilentDeed(db, category, note.trim() || null, toDateKey());
    setModalVisible(false);
    setNote("");
    load();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const db = await getDatabase();
    await deleteSilentDeed(db, deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <ScreenContainer scroll={false}>
      <StackBackButton
        label="More"
        onPress={() => navigation.navigate("MoreMenu")}
      />

      <SectionHeader
        title="Silent Deeds"
        subtitle="Private acts known only to you and Allah"
        action={
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
          >
            <Plus size={22} color={colors.bg.primary} />
          </Pressable>
        }
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: listBottomPadding },
        ]}
        ListEmptyComponent={
          <EmptyState
            title="Your hidden good deeds"
            message="Record kindness, charity, and duas for others — kept entirely private."
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.deed}>
            <View style={styles.deedContent}>
              <Text style={styles.deedCategory}>{item.category}</Text>
              {item.note ? (
                <Text style={styles.deedNote}>{item.note}</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() =>
                setDeleteTarget({ id: item.id, category: item.category })
              }
              style={styles.deleteBtn}
              accessibilityLabel="Delete deed"
              hitSlop={8}
            >
              <Trash2 size={20} color={colors.accent.gold} />
            </Pressable>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add silent deed</Text>
            <View style={styles.categories}>
              {DEED_CATEGORIES.map((c) => (
                <PillButton
                  key={c}
                  label={c}
                  active={category === c}
                  onPress={() => setCategory(c)}
                />
              ))}
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Optional note (private)"
              placeholderTextColor={colors.text.dim}
              value={note}
              onChangeText={setNote}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAdd} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save privately</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete deed"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.category}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep deed"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </ScreenContainer>
  );
}

function groupByDate(deeds: SilentDeed[]) {
  const map = new Map<string, SilentDeed[]>();
  for (const deed of deeds) {
    const list = map.get(deed.date) ?? [];
    list.push(deed);
    map.set(deed.date, list);
  }
  return [...map.entries()].map(([date, data]) => ({
    title: formatSectionDate(date),
    data,
  }));
}

function formatSectionDate(dateKey: string): string {
  try {
    return format(parseISO(dateKey), "EEEE, MMM d");
  } catch {
    return dateKey;
  }
}

const styles = StyleSheet.create({
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.emerald,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flexGrow: 1,
  },
  sectionTitle: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  deed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glass.fill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: 8,
    overflow: "hidden",
  },
  deedContent: {
    flex: 1,
    padding: 16,
    paddingRight: 8,
  },
  deleteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deedCategory: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  deedNote: {
    color: colors.text.muted,
    fontSize: 14,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: colors.bg.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: "80%",
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.md,
  },
  noteInput: {
    backgroundColor: colors.glass.fill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    color: colors.text.primary,
    padding: 16,
    minHeight: 80,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancel: {
    color: colors.text.muted,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: colors.accent.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radii.full,
  },
  saveText: {
    color: colors.bg.primary,
    fontWeight: "600",
  },
});
