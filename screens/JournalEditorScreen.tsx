import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { StackBackButton } from "../components/ui/StackBackButton";
import { colors, radii, spacing } from "../constants/theme";
import { getDatabase } from "../database/client";
import {
  deleteJournalEntry,
  getJournalEntry,
  saveJournalEntry,
} from "../database/repositories/journal";
import type { ReflectStackParamList } from "../navigation/types";

const TAG_OPTIONS = ["gratitude", "dua", "reflection", "goals"];

export function JournalEditorScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ReflectStackParamList, "JournalEditor">>();
  const entryId = route.params?.entryId;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string>("reflection");
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    if (entryId) loadEntry();
  }, [entryId]);

  async function loadEntry() {
    const db = await getDatabase();
    const entry = await getJournalEntry(db, entryId!);
    if (entry) {
      setTitle(entry.title);
      setBody(entry.body);
      setTags(entry.tags || "reflection");
    }
  }

  async function handleSave() {
    const db = await getDatabase();
    await saveJournalEntry(db, {
      id: entryId,
      title: title.trim() || "Untitled reflection",
      body: body.trim(),
      tags,
    });
    navigation.goBack();
  }

  async function handleDeleteConfirm() {
    if (!entryId) return;
    const db = await getDatabase();
    await deleteJournalEntry(db, entryId);
    setDeleteVisible(false);
    navigation.goBack();
  }

  return (
    <ScreenContainer scroll={false}>
      <StackBackButton
        label="Journal"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.toolbar}>
        {entryId ? (
          <Pressable
            onPress={() => setDeleteVisible(true)}
            style={styles.deleteBtn}
            accessibilityLabel="Delete entry"
          >
            <Trash2 size={20} color={colors.accent.gold} />
            <Text style={styles.delete}>Delete</Text>
          </Pressable>
        ) : (
          <View />
        )}
        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.save}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.tags}>
        {TAG_OPTIONS.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => setTags(tag)}
            style={[styles.tag, tags === tag && styles.tagActive]}
          >
            <Text style={[styles.tagText, tags === tag && styles.tagTextActive]}>
              {tag}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor={colors.text.dim}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.bodyInput}
        placeholder="Write your thoughts with sincerity..."
        placeholderTextColor={colors.text.dim}
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
        autoFocus={!entryId}
      />

      <ConfirmDialog
        visible={deleteVisible}
        title="Delete entry"
        message="Remove this reflection permanently?"
        confirmLabel="Delete"
        cancelLabel="Keep entry"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  delete: {
    color: colors.accent.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  save: {
    color: colors.accent.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.lg,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  tagActive: {
    borderColor: colors.accent.emerald,
    backgroundColor: "rgba(45, 106, 79, 0.2)",
  },
  tagText: {
    color: colors.text.muted,
    fontSize: 13,
  },
  tagTextActive: {
    color: colors.accent.beige,
  },
  titleInput: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  bodyInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 17,
    lineHeight: 28,
  },
});
