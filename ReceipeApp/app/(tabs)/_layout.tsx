import { Tabs } from "expo-router";
import { HapticTab } from "../../components/haptic-tab";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="New"
        options={{
          title: "New",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
