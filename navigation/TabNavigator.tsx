import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import {
  BookOpen,
  Heart,
  Home,
  MoreHorizontal,
  Sparkles,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/theme";
import { DhikrScreen } from "../screens/DhikrScreen";
import { HabitsScreen } from "../screens/HabitsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { InsightsScreen } from "../screens/InsightsScreen";
import { JournalEditorScreen } from "../screens/JournalEditorScreen";
import { JournalScreen } from "../screens/JournalScreen";
import { MoreMenuScreen } from "../screens/MoreMenuScreen";
import { RemindersScreen } from "../screens/RemindersScreen";
import { SalahScreen } from "../screens/SalahScreen";
import { SilentDeedsScreen } from "../screens/SilentDeedsScreen";
import { SunnahScreen } from "../screens/SunnahScreen";
import type {
  GrowStackParamList,
  MoreStackParamList,
  ReflectStackParamList,
  TabParamList,
  WorshipStackParamList,
} from "./types";

const Tab = createBottomTabNavigator<TabParamList>();
const WorshipStack = createNativeStackNavigator<WorshipStackParamList>();
const GrowStack = createNativeStackNavigator<GrowStackParamList>();
const ReflectStack = createNativeStackNavigator<ReflectStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

const stackScreenOptions = {
  headerShown: false,
  animation: "fade_from_bottom" as const,
  contentStyle: { backgroundColor: colors.bg.primary },
};

function WorshipNavigator() {
  return (
    <WorshipStack.Navigator screenOptions={stackScreenOptions}>
      <WorshipStack.Screen name="Salah" component={SalahScreen} />
      <WorshipStack.Screen name="Dhikr" component={DhikrScreen} />
    </WorshipStack.Navigator>
  );
}

function GrowNavigator() {
  return (
    <GrowStack.Navigator screenOptions={stackScreenOptions}>
      <GrowStack.Screen name="Habits" component={HabitsScreen} />
      <GrowStack.Screen name="Sunnah" component={SunnahScreen} />
    </GrowStack.Navigator>
  );
}

function ReflectNavigator() {
  return (
    <ReflectStack.Navigator screenOptions={stackScreenOptions}>
      <ReflectStack.Screen name="Journal" component={JournalScreen} />
      <ReflectStack.Screen
        name="JournalEditor"
        component={JournalEditorScreen}
      />
    </ReflectStack.Navigator>
  );
}

function MoreNavigator() {
  return (
    <MoreStack.Navigator screenOptions={stackScreenOptions}>
      <MoreStack.Screen name="MoreMenu" component={MoreMenuScreen} />
      <MoreStack.Screen name="SilentDeeds" component={SilentDeedsScreen} />
      <MoreStack.Screen name="Reminders" component={RemindersScreen} />
      <MoreStack.Screen name="Insights" component={InsightsScreen} />
    </MoreStack.Navigator>
  );
}

function TabBarBackground() {
  return (
    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
      <View style={styles.tabBarOverlay} />
    </BlurView>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: colors.accent.gold,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const props = { color, size: size - 2 };
          switch (route.name) {
            case "Home":
              return <Home {...props} />;
            case "Worship":
              return <Heart {...props} />;
            case "Grow":
              return <Sparkles {...props} />;
            case "Reflect":
              return <BookOpen {...props} />;
            case "More":
              return <MoreHorizontal {...props} />;
            default:
              return <Home {...props} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Worship"
        component={WorshipNavigator}
        options={{ tabBarLabel: "Worship" }}
      />
      <Tab.Screen name="Grow" component={GrowNavigator} />
      <Tab.Screen name="Reflect" component={ReflectNavigator} />
      <Tab.Screen name="More" component={MoreNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    backgroundColor: "transparent",
    elevation: 0,
    height: 88,
    paddingTop: 8,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 12, 14, 0.75)",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
});
