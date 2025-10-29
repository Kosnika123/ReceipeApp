import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "../../components/haptic-tab";
import { useThemeColor } from "../../hooks/use-theme-color";

export default function TabLayout() {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: textColor,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
