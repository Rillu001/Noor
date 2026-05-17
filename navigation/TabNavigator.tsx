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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_CONTENT_HEIGHT } from "../constants/layout";
import { colors, spacing } from "../constants/theme";
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
    <WorshipStack.Navigator
      initialRouteName="Salah"
      screenOptions={stackScreenOptions}
    >
      <WorshipStack.Screen name="Salah" component={SalahScreen} />
      <WorshipStack.Screen name="Dhikr" component={DhikrScreen} />
    </WorshipStack.Navigator>
  );
}

function GrowNavigator() {
  return (
    <GrowStack.Navigator
      initialRouteName="Habits"
      screenOptions={stackScreenOptions}
    >
      <GrowStack.Screen name="Habits" component={HabitsScreen} />
      <GrowStack.Screen name="Sunnah" component={SunnahScreen} />
    </GrowStack.Navigator>
  );
}

function ReflectNavigator() {
  return (
    <ReflectStack.Navigator
      initialRouteName="Journal"
      screenOptions={stackScreenOptions}
    >
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
    <MoreStack.Navigator
      initialRouteName="MoreMenu"
      screenOptions={stackScreenOptions}
    >
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
  const insets = useSafeAreaInsets();
  const tabBarBottomInset = Math.max(insets.bottom, 12) + spacing.sm;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: TAB_BAR_CONTENT_HEIGHT + tabBarBottomInset,
          paddingBottom: tabBarBottomInset,
        },
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
        options={{
          tabBarLabel: "Worship",
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Worship", { screen: "Salah" });
          },
        })}
      />
      <Tab.Screen
        name="Grow"
        component={GrowNavigator}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Grow", { screen: "Habits" });
          },
        })}
      />
      <Tab.Screen
        name="Reflect"
        component={ReflectNavigator}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Reflect", { screen: "Journal" });
          },
        })}
      />
      <Tab.Screen
        name="More"
        component={MoreNavigator}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("More", { screen: "MoreMenu" });
          },
        })}
      />
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
