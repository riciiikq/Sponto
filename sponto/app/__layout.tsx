import { Stack } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  // Načítanie fontov (ak chceš vlastné)
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });   

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {/* Stack = navigácia medzi obrazovkami */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#0E0E10" },
        }}
      />
    </>
  );
}
