// app/src/screens/HomeScreen.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { INVITES, SMART_SUGGESTIONS, UPCOMING_TRIPS } from "../data/mockTrips";
import { Invite } from "../types/trips";

// jednoduchá príprava na viac jazykov
const LOCALE: "sk" | "en" = "sk";

const STRINGS = {
  sk: {
    heroTitle: "Spontánne výjazdy",
    heroSubtitle: "Vyhliadka, jedlo a kamaráti na pár ťuknutí.",
    quickStart: "Spusti spontánny trip",
    quickStartSub: "Vytvor trasu na dnes",
    aiIdea: "AI nápad",
    aiIdeaSub: "Navrhne trasu za teba",
    map: "Mapa okolia",
    mapSub: "Tripy a miesta okolo teba",
    nextTrip: "Najbližší trip",
    nextTripEmpty: "Zatiaľ nemáš naplánovaný žiadny trip.",
    upcomingViewAll: "Zobraziť všetky tripy",
    invitesTitle: "Pozvánky od kamarátov",
    invitesEmpty: "Zatiaľ žiadne pozvánky.",
    moodTitle: "Vyber si mood",
    moodChill: "Chill vyhliadka",
    moodFood: "Jedlo & drink",
    moodNight: "Night ride",
  },
  en: {
    heroTitle: "Spontaneous trips",
    heroSubtitle: "Viewpoints, food and friends in a few taps.",
    quickStart: "Start spontaneous trip",
    quickStartSub: "Create a route for today",
    aiIdea: "AI idea",
    aiIdeaSub: "Let AI plan it",
    map: "Map around you",
    mapSub: "Trips and spots nearby",
    nextTrip: "Next trip",
    nextTripEmpty: "You have no trips planned yet.",
    upcomingViewAll: "View all trips",
    invitesTitle: "Invites from friends",
    invitesEmpty: "No invites yet.",
    moodTitle: "Pick your mood",
    moodChill: "Chill viewpoint",
    moodFood: "Food & drinks",
    moodNight: "Night ride",
  },
};

const S = STRINGS[LOCALE];

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const tt = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dd} • ${tt}`;
}

// neskôr nahradíš API volaním napr. /ai/suggestion
const firstAiSuggestion = SMART_SUGGESTIONS[0];

export default function HomeScreen({ navigation }: any) {
  const nextTrip = UPCOMING_TRIPS[0];
  const invites = INVITES;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Dobré ráno";
    if (hour < 18) return "Ahoj";
    return "Dobrý večer";
  }, []);

  return (
    <LinearGradient
      colors={["#05001A", "#05001A", "#020617"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        >
          {/* TOP BAR */}
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{greeting} 👋</Text>
              <Text style={styles.heroTitle}>{S.heroTitle}</Text>
              <Text style={styles.heroSubtitle}>{S.heroSubtitle}</Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("Inbox")}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#E5E7EB"
              />
            </Pressable>
          </View>

          {/* HLAVNÁ AKCIA – SPONTÁNNY TRIP */}
          <Pressable
            onPress={() =>
              navigation.navigate("Trips", { quickCreate: true })
            }
            style={({ pressed }) => [
              styles.primaryCard,
              pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryLabel}>{S.quickStart}</Text>
              <Text style={styles.primarySub}>{S.quickStartSub}</Text>
            </View>
            <View style={styles.primaryIconCircle}>
              <Ionicons name="flash-outline" size={22} color="#FACC15" />
            </View>
          </Pressable>

          {/* DVE JEDNODUCHÉ VOĽBY: AI + MAPA */}
          <View style={styles.row}>
            <Pressable
              onPress={() =>
                navigation.navigate("Trips", { ai: true, preset: firstAiSuggestion?.action?.preset })
              }
              style={({ pressed }) => [
                styles.smallCard,
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={styles.smallIconCircle}>
                <MaterialCommunityIcons
                  name="sparkles"
                  size={18}
                  color="#FACC15"
                />
              </View>
              <Text style={styles.smallTitle}>{S.aiIdea}</Text>
              <Text style={styles.smallSub}>{S.aiIdeaSub}</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Map")}
              style={({ pressed }) => [
                styles.smallCard,
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={styles.smallIconCircle}>
                <Ionicons name="map-outline" size={18} color="#38BDF8" />
              </View>
              <Text style={styles.smallTitle}>{S.map}</Text>
              <Text style={styles.smallSub}>{S.mapSub}</Text>
            </Pressable>
          </View>

          {/* NAJBLIZSI TRIP – JEDNA JEDNODUCHÁ KARTA */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{S.nextTrip}</Text>
            <Pressable onPress={() => navigation.navigate("Trips")}>
              <Text style={styles.sectionLink}>{S.upcomingViewAll}</Text>
            </Pressable>
          </View>

          {nextTrip ? (
            <Pressable
              onPress={() =>
                navigation.navigate("Trips", { id: nextTrip.id })
              }
              style={({ pressed }) => [
                styles.nextTripCard,
                pressed && { opacity: 0.95 },
              ]}
            >
              <View style={styles.nextImageWrapper}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0?w=1200&q=60",
                  }}
                  style={styles.nextImage}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nextTitle}>{nextTrip.title}</Text>
                <Text style={styles.nextMeta}>
                  {formatDate(nextTrip.dateISO)} • {nextTrip.place}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{S.nextTripEmpty}</Text>
            </View>
          )}

          {/* MOOD – 3 VEĽMI JEDNODUCHÉ CHIPS */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            {S.moodTitle}
          </Text>
          <View style={styles.moodRow}>
            <MoodChip
              label={S.moodChill}
              icon="moon-outline"
              onPress={() =>
                navigation.navigate("Trips", { preset: { type: "chill" } })
              }
            />
            <MoodChip
              label={S.moodFood}
              icon="restaurant-outline"
              onPress={() =>
                navigation.navigate("Trips", { preset: { type: "food" } })
              }
            />
            <MoodChip
              label={S.moodNight}
              icon="car-outline"
              onPress={() =>
                navigation.navigate("Trips", { preset: { type: "night" } })
              }
            />
          </View>

          {/* POZVÁNKY – MAX 2, ZBYTOK CEZ INBOX */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{S.invitesTitle}</Text>
            <Pressable onPress={() => navigation.navigate("Inbox")}>
              <Text style={styles.sectionLink}>Inbox</Text>
            </Pressable>
          </View>

          {invites.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{S.invitesEmpty}</Text>
            </View>
          ) : (
            invites.slice(0, 2).map((invite) => (
              <InviteRow
                key={invite.id}
                invite={invite}
                onAccept={() => {}}
                onDecline={() => {}}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* SUBKOMPONENTY */

function MoodChip({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.moodChip,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Ionicons name={icon} size={14} color="#E5E7EB" />
      <Text style={styles.moodText}>{label}</Text>
    </Pressable>
  );
}

function InviteRow({
  invite,
  onAccept,
  onDecline,
}: {
  invite: Invite;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <View style={styles.inviteRow}>
      <View style={styles.inviteAvatar}>
        <Ionicons name="person-outline" size={16} color="#38BDF8" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.inviteTitle}>{invite.fromName} ťa pozýva</Text>
        <Text style={styles.inviteSub}>
          {invite.tripTitle} • {invite.when}
        </Text>
      </View>
      <Pressable
        onPress={onDecline}
        style={({ pressed }) => [
          styles.inviteSecondary,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.inviteSecondaryText}>Neskôr</Text>
      </Pressable>
      <Pressable
        onPress={onAccept}
        style={({ pressed }) => [
          styles.invitePrimary,
          pressed && { opacity: 0.9 },
        ]}
      >
        <Text style={styles.invitePrimaryText}>Pridať</Text>
      </Pressable>
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  greeting: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  iconButton: {
    borderRadius: 999,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1F2937",
    backgroundColor: "#020617",
  },

  primaryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#111827",
    marginBottom: 14,
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  primarySub: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  primaryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F2937",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  smallCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
  },
  smallIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    marginBottom: 8,
  },
  smallTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 2,
  },
  smallSub: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  sectionLink: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },

  nextTripCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    gap: 10,
  },
  nextImageWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  nextImage: {
    width: "100%",
    height: "100%",
  },
  nextTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  nextMeta: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },

  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#111827",
    padding: 12,
  },
  emptyText: {
    fontSize: 12,
    color: "#6B7280",
  },

  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  moodText: {
    fontSize: 11,
    color: "#E5E7EB",
  },

  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    gap: 10,
    marginBottom: 8,
  },
  inviteAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  inviteTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  inviteSub: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  inviteSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  inviteSecondaryText: {
    fontSize: 11,
    color: "#E5E7EB",
  },
  invitePrimary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#6366F1",
  },
  invitePrimaryText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
