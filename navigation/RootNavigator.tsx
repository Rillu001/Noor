import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors, navigationTheme } from "../constants/theme";
import type { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: colors.bg.primary,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
