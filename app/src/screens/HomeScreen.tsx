// src/screens/HomeScreen.tsx
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type ActivityItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string; // ISO
  type: "report" | "task" | "message";
};

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    title: "Nahlásená výtlková zóna",
    subtitle: "Račianska, Bratislava",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: "report",
  },
  {
    id: "a2",
    title: "Úloha: overiť fotku",
    subtitle: "Čaká na schválenie",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "task",
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "práve teraz";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>(MOCK_ACTIVITY);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setRefreshing(false);
  }, []);

  const onQuickAction = useCallback((key: "report" | "map" | "scan") => {
    // neskôr nahradíš navigation.navigate(...)
    console.warn("TODO action ->", key);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Hlavička */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Ahoj, Sponto používateľ</Text>
          <Text style={styles.subtitle}>Všetko dôležité na jednom mieste.</Text>
        </View>
      </View>

      {/* Rýchle akcie */}
      <View style={styles.actionsRow}>
        <Pressable onPress={() => onQuickAction("report")} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <View style={styles.actionIcon}>
            <MaterialCommunityIcons name="alert-octagon-outline" size={20} />
          </View>
          <Text style={styles.actionLabel}>Nahlásiť</Text>
        </Pressable>

        <Pressable onPress={() => onQuickAction("map")} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <View style={styles.actionIcon}>
            <Ionicons name="map-outline" size={20} />
          </View>
          <Text style={styles.actionLabel}>Mapa</Text>
        </Pressable>

        <Pressable onPress={() => onQuickAction("scan")} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <View style={styles.actionIcon}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} />
          </View>
          <Text style={styles.actionLabel}>Skenovať</Text>
        </Pressable>
      </View>

      {/* Posledná aktivita */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Posledná aktivita</Text>
        <Pressable onPress={onRefresh}>
          <Text style={styles.sectionLink}>Obnoviť</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={activity}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={activity.length === 0 ? { flex: 1 } : undefined}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="albums-outline" size={28} />
              <Text style={styles.emptyTitle}>Zatiaľ tu nič nie je</Text>
              <Text style={styles.emptyText}>Začni rýchlou akciou vyššie.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={() => console.warn("TODO: detail", item.id)}>
              <View style={styles.cardIcon}>
                {item.type === "report" && <MaterialCommunityIcons name="alert-circle-outline" size={18} />}
                {item.type === "task" && <Ionicons name="checkmark-done-outline" size={18} />}
                {item.type === "message" && <Ionicons name="chatbubble-ellipses-outline" size={18} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.cardSubtitle}>{item.subtitle}</Text> : null}
              </View>
              <Text style={styles.cardMeta}>{timeAgo(item.createdAt)}</Text>
            </Pressable>
          )}
        />
      )}

      {/* FAB */}
      <Pressable onPress={() => onQuickAction("report")} style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}>
        <Ionicons name="add" size={22} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  greeting: { fontSize: 22, fontWeight: "700" },
  subtitle: { opacity: 0.7, marginTop: 2 },
  actionsRow: { flexDirection: "row", gap: 12, marginVertical: 12 },
  action: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { marginBottom: 6 },
  actionLabel: { fontWeight: "600" },
  sectionHeader: { marginTop: 8, marginBottom: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  sectionLink: { fontSize: 13, textDecorationLine: "underline", opacity: 0.8 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    marginBottom: 10,
  },
  cardIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardTitle: { fontWeight: "600" },
  cardSubtitle: { fontSize: 12, opacity: 0.7, marginTop: 2 },
  cardMeta: { fontSize: 12, opacity: 0.6, marginLeft: 8 },
  empty: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },
  emptyTitle: { fontWeight: "700", marginTop: 2 },
  emptyText: { opacity: 0.7 },
  loading: { alignItems: "center", padding: 24 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "white",
  },
  pressed: { opacity: 0.7 },
});
