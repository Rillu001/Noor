import { create } from "zustand";
import { getDatabase } from "../database/client";
import {
  changeUserPassword,
  loginUser,
  logoutUser,
  registerUser,
  restoreSession,
  updateUserName,
  type AuthUser,
} from "../services/auth";

type AuthState = {
  user: AuthUser | null;
  authReady: boolean;
  hydrateSession: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  authReady: false,

  hydrateSession: async () => {
    try {
      const db = await getDatabase();
      const user = await restoreSession(db);
      set({ user, authReady: true });
    } catch {
      set({ user: null, authReady: true });
    }
  },

  register: async (name, email, password) => {
    const db = await getDatabase();
    const user = await registerUser(db, name, email, password);
    set({ user });
  },

  login: async (email, password) => {
    const db = await getDatabase();
    const user = await loginUser(db, email, password);
    set({ user });
  },

  logout: async () => {
    await logoutUser();
    set({ user: null });
  },

  updateProfile: async (name) => {
    const db = await getDatabase();
    const userId = get().user?.id;
    if (!userId) {
      throw new Error("You are not signed in.");
    }
    const user = await updateUserName(db, userId, name);
    set({ user });
  },

  changePassword: async (currentPassword, newPassword) => {
    const db = await getDatabase();
    const userId = get().user?.id;
    if (!userId) {
      throw new Error("You are not signed in.");
    }
    await changeUserPassword(db, userId, currentPassword, newPassword);
  },
}));
