// app/src/navigation/TabNavigator.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import TripsScreen from "../screens/TripsScreen";
// tieto si buď vytvoríš ako placeholdery, alebo už máš:

export type TabParamList = {
  Home: undefined;
  Trips: undefined;
  Map: undefined;
  Inbox: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor: "#111827",
          height: Platform.OS === "ios" ? 80 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Home") iconName = "home-outline";
          if (route.name === "Trips") iconName = "trail-sign-outline" as any;
          if (route.name === "Map") iconName = "map-outline";
          if (route.name === "Inbox") iconName = "chatbubbles-outline";
          if (route.name === "Profile") iconName = "person-circle-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{ title: "Tripy" }}
      />
      {/* <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Mapa" }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{ title: "Inbox" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      /> */}
    </Tab.Navigator>
  );
}
