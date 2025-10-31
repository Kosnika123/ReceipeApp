import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "../../components/haptic-tab";
import { useThemeColor } from "../../hooks/use-theme-color";
import { IconSymbol } from "../../components/ui/icon-symbol";

export default function TabLayout() {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const headerBg = "#0f6ae1ff";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarStyle: { backgroundColor: headerBg },
        headerShown: true,
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: "#fff",
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "New",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add" : "add-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
        <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}