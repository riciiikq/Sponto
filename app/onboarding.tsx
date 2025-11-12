import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();

  const proceed = async () => {
    await AsyncStorage.setItem("sponto_seen_onboarding", "1");
    router.replace("/(auth)/login"); // ak používaš prihlásenie; inak pošleme na (tabs)
  };

  return (
    <LinearGradient
      colors={["#0b0b12", "#0e0e18", "#121225"]}
      style={styles.container}
    >
      {/* logo / názov */}
      <View style={styles.header}>
        <View style={styles.logoDot}/>
        <Text style={styles.brand}>sponto</Text>
      </View>

      {/* hero karta s obrázkom */}
      <View style={styles.card}>
        <Image
          source={require("../assets/hero-night.jpg")} // nahraj obrázok podľa makety
          style={styles.hero}
          resizeMode="cover"
        />
        <View style={styles.cardText}>
          <Text style={styles.title}>Spontaneous Friday Nights</Text>
          <Text style={styles.desc}>
            Join convoys, find secret spots, and create epic memories with your crew.
          </Text>
        </View>
      </View>

      {/* tlačidlá social login – zatiaľ ako UI stuby */}
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.btnGoogle]} onPress={proceed}>
          <Ionicons name="logo-google" size={18} color="#111" />
          <Text style={[styles.btnText, styles.btnTextDark]}>Continue with Google</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnApple]} onPress={proceed}>
          <Ionicons name="logo-apple" size={20} color="#fff" />
          <Text style={styles.btnText}>Continue with Apple</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnFacebook]} onPress={proceed}>
          <Ionicons name="logo-facebook" size={18} color="#fff" />
          <Text style={styles.btnText}>Continue with Facebook</Text>
        </Pressable>
      </View>

      {/* terms */}
      <Text style={styles.terms}>
        By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </LinearGradient>
  );
}

const R = {
  bg: "#0b0b12",
  card: "#151525",
  border: "#1f2137",
  text: "#d6d8f0",
  sub: "#a5a8c8",
  primary: "#7c4dff", // neon purple pre akcenty
  googleBg: "#ffffff",
  fbBg: "#1877F2",
  appleBg: "#000000",
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24, justifyContent: "space-between" },
  header: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  logoDot: {
    width: 18, height: 18, borderRadius: 9, marginRight: 8,
    backgroundColor: R.primary, shadowColor: R.primary, shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 }, shadowRadius: 10,
  },
  brand: { color: "#fff", fontSize: 20, fontWeight: "800", letterSpacing: 0.5 },

  card: {
    backgroundColor: R.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: R.border,
    overflow: "hidden",
  },
  hero: { width: "100%", height: 200 },
  cardText: { padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },
  desc: { color: R.sub, marginTop: 6, lineHeight: 20 },

  actions: { gap: 10, marginTop: 10 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
  },
  btnGoogle: { backgroundColor: R.googleBg, borderColor: "#E5E7EB" },
  btnApple: { backgroundColor: R.appleBg, borderColor: "#111" },
  btnFacebook: { backgroundColor: R.fbBg, borderColor: "#0f4fd9" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnTextDark: { color: "#111", fontWeight: "700" },

  terms: { color: R.sub, textAlign: "center", fontSize: 12, marginBottom: 16, marginTop: 6 },
  link: { color: "#9aa3ff", fontWeight: "700" },
});
