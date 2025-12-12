// app/src/screens/MapScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Button from "../../../components/Button";

const MAPBOX_TOKEN_KEY = "mapbox_token";

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mapboxToken, setMapboxToken] = useState("");
  const [savedToken, setSavedToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const stored = await AsyncStorage.getItem(MAPBOX_TOKEN_KEY);
      if (stored) {
        setSavedToken(stored);
      }
    } catch (error) {
      console.error("Error loading token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToken = async () => {
    const trimmed = mapboxToken.trim();
    if (trimmed) {
      try {
        await AsyncStorage.setItem(MAPBOX_TOKEN_KEY, trimmed);
        setSavedToken(trimmed);
        setMapboxToken("");
      } catch (error) {
        console.error("Error saving token:", error);
      }
    }
  };

  const html = useMemo(() => {
    if (!savedToken) return "";
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <style>body,html,#map { margin:0; padding:0; height:100%; }</style>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      </head>
      <body>
        <div id='map'></div>
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
        <script>
          mapboxgl.accessToken = '${savedToken}';
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [17.5, 48.2],
            zoom: 8
          });
        </script>
      </body>
      </html>
    `;
  }, [savedToken]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#F9FAFB" />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.title}>Mapa okolia</Text>
        {!savedToken && !isLoading ? (
          <View style={{ width: '100%' }}>
            <Text style={styles.subtitle}>Zadaj svoj Mapbox token (prvý krát):</Text>
            <TextInput
              value={mapboxToken}
              onChangeText={setMapboxToken}
              placeholder="MAPBOX_TOKEN"
              placeholderTextColor="#6B7280"
              style={[styles.input, Platform.OS === 'web' ? { width: '100%' } : {}]}
              autoCapitalize="none"
            />
            <View style={{ height: 12 }} />
            <Button
              title="Uložiť token a zobraziť mapu"
              onPress={handleSaveToken}
            />
          </View>
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
            {savedToken && (
              <WebView
                originWhitelist={["*"]}
                source={{ html }}
                style={{ flex: 1 }}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05001A" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { color: "#F9FAFB", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#9CA3AF", textAlign: "center", marginBottom: 20 },
  button: {
    backgroundColor: "#0B1220",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  buttonText: { color: "#E5E7EB", fontWeight: "700" },
  input: {
    backgroundColor: "#0B1220",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#F9FAFB",
  },
  backButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
