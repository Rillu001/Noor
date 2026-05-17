import { LogOut, User, X } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "../../constants/theme";

type UserMenuModalProps = {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onProfile: () => void;
  onLogout: () => void;
};

export function UserMenuModal({
  visible,
  userName,
  onClose,
  onProfile,
  onLogout,
}: UserMenuModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.menu,
            { top: insets.top + spacing.lg + 52, right: spacing.md },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.menuInner}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>{userName}</Text>
                <Pressable onPress={onClose} hitSlop={8}>
                  <X size={20} color={colors.text.muted} />
                </Pressable>
              </View>

              <Pressable onPress={onProfile} style={styles.menuItem}>
                <User size={20} color={colors.accent.gold} />
                <Text style={styles.menuItemText}>Profile</Text>
              </Pressable>

              <View style={styles.divider} />

              <Pressable onPress={onLogout} style={styles.menuItem}>
                <LogOut size={20} color={colors.accent.gold} />
                <Text style={styles.menuItemText}>Sign out</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  menu: {
    position: "absolute",
    minWidth: 200,
  },
  menuInner: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingVertical: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  menuTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  menuItemText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.glass.border,
    marginHorizontal: spacing.md,
  },
});
