import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

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
