import type { NavigatorScreenParams } from "@react-navigation/native";

export type WorshipStackParamList = {
  Salah: undefined;
  Dhikr: undefined;
};

export type GrowStackParamList = {
  Habits: undefined;
  Sunnah: undefined;
};

export type ReflectStackParamList = {
  Journal: undefined;
  JournalEditor: { entryId?: number };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Profile: undefined;
  SilentDeeds: undefined;
  Reminders: undefined;
  Insights: undefined;
};

export type TabParamList = {
  Home: undefined;
  Worship: NavigatorScreenParams<WorshipStackParamList>;
  Grow: NavigatorScreenParams<GrowStackParamList>;
  Reflect: NavigatorScreenParams<ReflectStackParamList>;
  More: NavigatorScreenParams<MoreStackParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
};
