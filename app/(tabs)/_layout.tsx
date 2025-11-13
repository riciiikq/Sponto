// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor: "#111827",
          height: 70,
          paddingBottom: 12,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Tripy",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trail-sign-outline" color={color} size={size as any} />
          ),
        }}
      />
      {/* ďalšie taby si doplníme neskôr */}
    </Tabs>
  );
}
