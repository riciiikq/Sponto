import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../providers/AuthProvider";

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      // 1) First launch -> onboarding
      const seen = await AsyncStorage.getItem("sponto_seen_onboarding");
      if (!seen && segments[0] !== "onboarding") {
        router.replace("/onboarding");
        return;
      }

      // 2) Auth flow
      if (!loading) {
        const inAuth = segments[0] === "(auth)";
        const inTabs = segments[0] === "(tabs)";
        if (!user && !inAuth && segments[0] !== "onboarding") router.replace("/(auth)/login");
        if (user && (inAuth || segments[0] === "onboarding")) router.replace("/(tabs)");
      }
    })();
  }, [segments, user, loading, router]);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#0D1117" }}>
        <ActivityIndicator size="large" color="#58A6FF" />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Gate>
        <Stack screenOptions={{ headerShown:false, animation:"fade", contentStyle:{ backgroundColor:"#0D1117" } }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Gate>
    </AuthProvider>
  );
}
