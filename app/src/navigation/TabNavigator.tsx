import HomeScreen from "../screens/HomeScreen";
import Placeholder from "../screens/_Placeholder";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

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
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Domov",
          tabBarIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Trips"
        component={Placeholder}
        options={{
          tabBarLabel: "Tripy",
          tabBarIcon: ({ size, color }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={Placeholder}
        options={{
          tabBarLabel: "Mapa",
          tabBarIcon: ({ size, color }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={Placeholder}
        options={{
          tabBarLabel: "Doručené",
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="message-text-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Placeholder}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ size, color }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
