// app/src/screens/ProfileScreen.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(user ?? "");

  const handleSave = () => {
    // v tomto jednoduchom prototype použijeme `login` na aktualizáciu emailu
    login(email);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    // prejdeme na auth screen
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profil</Text>

        <Text style={styles.label}>Email</Text>
        {editing ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        ) : (
          <Text style={styles.subtitle}>{user ?? "Nie si prihlásený"}</Text>
        )}

        <View style={{ height: 16 }} />

        {editing ? (
          <>
            <Button title="Uložiť" onPress={() => handleSave()} />
            <Pressable onPress={() => setEditing(false)} style={{ marginTop: 12 }}>
              <Text style={styles.link}>Zrušiť</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Button title="Upraviť profil" onPress={() => setEditing(true)} />
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Odhlásiť sa</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05001A" },
  content: { flex: 1, padding: 16, justifyContent: "center" },
  title: { color: "#F9FAFB", fontSize: 20, fontWeight: "800", marginBottom: 12 },
  label: { color: "#9CA3AF", fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#0B1220",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#F9FAFB",
  },
  subtitle: { color: "#9CA3AF", marginTop: 4 },
  link: { color: "#9CA3AF", fontWeight: "600", textAlign: "center" },
  logoutButton: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#F97316", fontWeight: "700", fontSize: 16 },
});
