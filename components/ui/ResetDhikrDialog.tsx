import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../../constants/theme";

type ResetDhikrDialogProps = {
  visible: boolean;
  phrase: string;
  onResetToday: () => void;
  onResetAllHistory: () => void;
  onCancel: () => void;
};

export function ResetDhikrDialog({
  visible,
  phrase,
  onResetToday,
  onResetAllHistory,
  onCancel,
}: ResetDhikrDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Reset dhikr</Text>
          <Text style={styles.message}>
            {`Choose what to reset for "${phrase}". These actions cannot be undone.`}
          </Text>

          <Pressable onPress={onResetToday} style={styles.optionBtn}>
            <Text style={styles.optionTitle}>Reset today only</Text>
            <Text style={styles.optionDesc}>
              Sets today's count to zero. Past days stay in your history.
            </Text>
          </Pressable>

          <Pressable
            onPress={onResetAllHistory}
            style={[styles.optionBtn, styles.optionDestructive]}
          >
            <Text style={[styles.optionTitle, styles.optionTitleDestructive]}>
              Clear all history
            </Text>
            <Text style={styles.optionDesc}>
              Clears all saved dhikr counts, charts, and totals across every phrase.
            </Text>
          </Pressable>

          <Pressable onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.bg.elevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  optionBtn: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.fill,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionDestructive: {
    borderColor: "rgba(201, 169, 98, 0.35)",
    backgroundColor: "rgba(201, 169, 98, 0.08)",
  },
  optionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionTitleDestructive: {
    color: colors.accent.gold,
  },
  optionDesc: {
    color: colors.text.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  cancelBtn: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    color: colors.text.muted,
    fontSize: 15,
    fontWeight: "600",
  },
});
