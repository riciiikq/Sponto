import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchUpcomingTrips } from "../../lib/api";
import { useAuth } from "../../providers/AuthProvider";

type Trip = { id: string; title: string; date: string };

export default function Home() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchUpcomingTrips();
      setTrips(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greet}>Ahoj, {user?.email ?? "Sponto user"} 👋</Text>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Pripravený na večer?</Text>
        <Text style={styles.heroSub}>Vytvor trip a pozvi posádku.</Text>
        <TouchableOpacity style={styles.heroCta}>
          <Text style={styles.heroCtaText}>+ Vytvoriť trip</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.section}>Najbližšie tripy</Text>

      {loading ? (
        <Text style={styles.loading}>Načítavam…</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.date}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Zatiaľ žiadne tripy</Text>
          }
          contentContainerStyle={{ paddingBottom: 12 }}
        />
      )}

      <Text style={styles.section}>Rýchle akcie</Text>
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickText}>Pozvať priateľov</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickText}>Zdieľať polohu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    padding: 16,
    paddingTop: 54,
  },
  greet: { color: "#C9D1D9", marginBottom: 10 },
  hero: {
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  heroTitle: { color: "#58A6FF", fontSize: 20, fontWeight: "800" },
  heroSub: { color: "#94A3B8", marginTop: 4, marginBottom: 12 },
  heroCta: {
    backgroundColor: "#238636",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  heroCtaText: { color: "#fff", fontWeight: "700" },
  section: {
    color: "#C9D1D9",
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "700",
  },
  loading: { color: "#8B949E" },
  empty: { color: "#8B949E", textAlign: "center", marginVertical: 12 },
  card: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderColor: "#1F2937",
    borderWidth: 1,
  },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cardSub: { color: "#8B949E", marginTop: 4 },
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtn: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  quickText: { color: "#C9D1D9", fontWeight: "600" },
});
