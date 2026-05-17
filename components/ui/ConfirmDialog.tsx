import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../../constants/theme";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={[
                styles.confirmBtn,
                isDestructive ? styles.confirmDestructive : styles.confirmDefault,
              ]}
            >
              <Text
                style={[
                  styles.confirmText,
                  isDestructive && styles.confirmTextDestructive,
                ]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
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
    maxWidth: 340,
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
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: "center",
  },
  cancelText: {
    color: colors.text.muted,
    fontSize: 15,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.full,
    alignItems: "center",
  },
  confirmDefault: {
    backgroundColor: colors.accent.gold,
  },
  confirmDestructive: {
    backgroundColor: "rgba(201, 169, 98, 0.15)",
    borderWidth: 1,
    borderColor: colors.accent.gold,
  },
  confirmText: {
    color: colors.bg.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  confirmTextDestructive: {
    color: colors.accent.gold,
  },
});
