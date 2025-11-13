// app/src/screens/TripsScreen.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SMART_SUGGESTIONS, UPCOMING_TRIPS } from "../data/mockTrips";
import { Trip } from "../types/trips";

const LOCALE: "sk" | "en" = "sk";

const STRINGS = {
  sk: {
    title: "Tripy",
    segmentUpcoming: "Plánované",
    segmentPast: "Minulé",
    segmentAi: "AI návrhy",
    filterToday: "Dnes",
    filterWeekend: "Víkend",
    filterFriends: "Partia",
    filterFamily: "Rodina",
    sectionUpcomingEmpty: "Zatiaľ nemáš naplánované žiadne tripy.",
    sectionPastEmpty: "Ešte nemáš žiadne ukončené tripy.",
    sectionAiTitle: "AI návrhy tripov",
    sectionAiEmpty: "Aktuálne žiadne návrhy. Skús neskôr alebo vytvor vlastný trip.",
    createTrip: "Nový trip",
    editPreferences: "Upraviť preferencie",
    aiTag: "AI",
  },
  en: {
    title: "Trips",
    segmentUpcoming: "Upcoming",
    segmentPast: "Past",
    segmentAi: "AI ideas",
    filterToday: "Today",
    filterWeekend: "Weekend",
    filterFriends: "Friends",
    filterFamily: "Family",
    sectionUpcomingEmpty: "You have no upcoming trips yet.",
    sectionPastEmpty: "You don’t have any past trips yet.",
    sectionAiTitle: "AI trip ideas",
    sectionAiEmpty:
      "No ideas at the moment. Try again later or create your own trip.",
    createTrip: "New trip",
    editPreferences: "Edit preferences",
    aiTag: "AI",
  },
};

const S = STRINGS[LOCALE];

// Neskôr nahradíš reálnymi API volaniami.
function fetchUpcomingTrips(): Trip[] {
  return UPCOMING_TRIPS;
}
function fetchPastTrips(): Trip[] {
  // zatiaľ prázdne – backend/pseudo logika
  return [];
}
function fetchAiIdeas() {
  return SMART_SUGGESTIONS;
}

function formatDateShort(iso: string) {
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

type SegmentKey = "upcoming" | "past" | "ai";

export default function TripsScreen({ navigation }: any) {
  const [segment, setSegment] = useState<SegmentKey>("upcoming");
  const [filterToday, setFilterToday] = useState(false);
  const [filterWeekend, setFilterWeekend] = useState(false);
  const [filterFriends, setFilterFriends] = useState(false);
  const [filterFamily, setFilterFamily] = useState(false);

  const upcomingTrips = fetchUpcomingTrips();
  const pastTrips = fetchPastTrips();
  const aiIdeas = fetchAiIdeas();

  const filteredUpcoming = useMemo(
    () => applyFilters(upcomingTrips, { filterToday, filterWeekend, filterFriends, filterFamily }),
    [upcomingTrips, filterToday, filterWeekend, filterFriends, filterFamily]
  );

  const filteredPast = useMemo(
    () => applyFilters(pastTrips, { filterToday, filterWeekend, filterFriends, filterFamily }),
    [pastTrips, filterToday, filterWeekend, filterFriends, filterFamily]
  );

  const showTrips = segment === "upcoming" ? filteredUpcoming : filteredPast;

  return (
    <LinearGradient
      colors={["#05001A", "#05001A", "#020617"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.container}>
        {/* Header + CTA */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{S.title}</Text>
          <Pressable
            onPress={() => navigation.navigate("Trips", { quickCreate: true })}
            style={({ pressed }) => [
              styles.createButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.createButtonText}>{S.createTrip}</Text>
          </Pressable>
        </View>

        {/* Segmented control */}
        <View style={styles.segmentWrapper}>
          <SegmentTab
            label={S.segmentUpcoming}
            active={segment === "upcoming"}
            onPress={() => setSegment("upcoming")}
          />
          <SegmentTab
            label={S.segmentPast}
            active={segment === "past"}
            onPress={() => setSegment("past")}
          />
          <SegmentTab
            label={S.segmentAi}
            active={segment === "ai"}
            onPress={() => setSegment("ai")}
          />
        </View>

        {/* Filters */}
        {segment !== "ai" && (
          <View style={styles.filtersRow}>
            <FilterChip
              label={S.filterToday}
              active={filterToday}
              onPress={() => setFilterToday(!filterToday)}
            />
            <FilterChip
              label={S.filterWeekend}
              active={filterWeekend}
              onPress={() => setFilterWeekend(!filterWeekend)}
            />
            <FilterChip
              label={S.filterFriends}
              active={filterFriends}
              onPress={() => setFilterFriends(!filterFriends)}
            />
            <FilterChip
              label={S.filterFamily}
              active={filterFamily}
              onPress={() => setFilterFamily(!filterFamily)}
            />
          </View>
        )}

        {/* Content */}
        {segment === "ai" ? (
          <View style={{ flex: 1 }}>
            <View style={styles.aiHeaderRow}>
              <Text style={styles.aiTitle}>{S.sectionAiTitle}</Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("Profile", { section: "preferences" })
                }
              >
                <Text style={styles.aiPrefs}>{S.editPreferences}</Text>
              </Pressable>
            </View>
            {aiIdeas.length === 0 ? (
              <EmptyState text={S.sectionAiEmpty} />
            ) : (
              <FlatList
                data={aiIdeas}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("Trips", { preset: item.action?.preset })
                    }
                    style={({ pressed }) => [
                      styles.aiCard,
                      pressed && { opacity: 0.9 },
                    ]}
                  >
                    <View style={styles.aiTagRow}>
                      <View style={styles.aiTagBubble}>
                        <MaterialCommunityIcons
                          name="sparkles"
                          size={14}
                          color="#FACC15"
                        />
                        <Text style={styles.aiTagText}>{S.aiTag}</Text>
                      </View>
                    </View>
                    <Text style={styles.aiCardTitle}>{item.title}</Text>
                    <Text style={styles.aiCardSub}>{item.sub}</Text>
                  </Pressable>
                )}
              />
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {showTrips.length === 0 ? (
              <EmptyState
                text={
                  segment === "upcoming"
                    ? S.sectionUpcomingEmpty
                    : S.sectionPastEmpty
                }
              />
            ) : (
              <FlatList
                data={showTrips}
                keyExtractor={(t) => t.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TripRow
                    trip={item}
                    onPress={() => navigation.navigate("Trips", { id: item.id })}
                  />
                )}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

/* === Filter logic === */

function applyFilters(
  trips: Trip[],
  opts: {
    filterToday: boolean;
    filterWeekend: boolean;
    filterFriends: boolean;
    filterFamily: boolean;
  }
): Trip[] {
  const { filterToday, filterWeekend, filterFriends, filterFamily } = opts;
  if (!filterToday && !filterWeekend && !filterFriends && !filterFamily) {
    return trips;
  }

  return trips.filter((t) => {
    let ok = true;
    const d = new Date(t.dateISO);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    const day = d.getDay(); // 0=Sun..6=Sat
    const isWeekend = day === 0 || day === 6;

    if (filterToday && !isToday) ok = false;
    if (filterWeekend && !isWeekend) ok = false;

    if (filterFriends && t.audience !== "friends") ok = false;
    if (filterFamily && t.audience !== "family") ok = false;

    return ok;
  });
}

/* === Subcomponents === */

function SegmentTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.segmentTab,
        active && styles.segmentTabActive,
        pressed && !active && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        active && styles.filterChipActive,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TripRow({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tripRow,
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.tripThumbWrapper}>
        <Image
          source={{
            uri:
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=60",
          }}
          style={styles.tripThumb}
        />
        {trip.visibility === "public" && (
          <View style={styles.tripChip}>
            <Text style={styles.tripChipText}>PUBLIC</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tripRowTitle} numberOfLines={1}>
          {trip.title}
        </Text>
        <Text style={styles.tripRowMeta} numberOfLines={1}>
          {formatDateShort(trip.dateISO)} • {trip.place} • {trip.durationHrs} h
        </Text>
        <View style={styles.tripRowBadges}>
          {trip.kidsFriendly && (
            <RowBadge
              icon="baby-carriage"
              label="kids"
              color="#F97316"
            />
          )}
          <RowBadge
            icon="account-group-outline"
            label={`${trip.participants.length}`}
            color="#38BDF8"
          />
        </View>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={18}
        color="#6B7280"
        style={{ marginLeft: 4 }}
      />
    </Pressable>
  );
}

function RowBadge({
  icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.rowBadge, { borderColor: color }]}>
      <MaterialCommunityIcons name={icon} size={10} color={color} />
      <Text style={[styles.rowBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyWrapper}>
      <Ionicons name="trail-sign-outline" size={26} color="#4B5563" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

/* === Styles === */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  glowTop: {
    position: "absolute",
    top: -120,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "#4F46E555",
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "#22C55E33",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    flex: 1,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#6366F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  segmentWrapper: {
    flexDirection: "row",
    borderRadius: 999,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    padding: 4,
    marginBottom: 10,
  },
  segmentTab: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentTabActive: {
    backgroundColor: "#111827",
  },
  segmentLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  segmentLabelActive: {
    color: "#E5E7EB",
  },

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2937",
    backgroundColor: "#020617",
  },
  filterChipActive: {
    backgroundColor: "#111827",
    borderColor: "#4F46E5",
  },
  filterChipText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  filterChipTextActive: {
    color: "#E5E7EB",
  },

  aiHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F9FAFB",
  },
  aiPrefs: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },

  aiCard: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    marginBottom: 10,
  },
  aiTagRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  aiTagBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#0F172A",
  },
  aiTagText: {
    fontSize: 10,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  aiCardSub: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  tripRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tripThumbWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#020617",
    marginRight: 4,
  },
  tripThumb: {
    width: "100%",
    height: "100%",
  },
  tripChip: {
    position: "absolute",
    bottom: 4,
    left: 4,
    borderRadius: 999,
    backgroundColor: "#111827CC",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tripChipText: {
    fontSize: 9,
    color: "#F9FAFB",
    fontWeight: "700",
  },
  tripRowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 2,
  },
  tripRowMeta: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  tripRowBadges: {
    flexDirection: "row",
    marginTop: 4,
    gap: 4,
  },
  rowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  rowBadgeText: {
    fontSize: 9,
    fontWeight: "600",
  },

  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
