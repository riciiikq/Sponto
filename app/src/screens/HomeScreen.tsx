// app/src/screens/HomeScreen.tsx (uprav cestu podľa projektu)
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  FlatList,
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

const LOCALE: "sk" | "en" = "sk"; // neskôr napojíš na systém/užívateľa

const STRINGS = {
  sk: {
    greetingMorning: "Dobré ráno",
    greetingDay: "Ahoj",
    greetingEvening: "Dobrý večer",
    heroSubtitle: "Spontánne výlety, vyhliadky a jedlo po ceste.",
    quickTonight: "Dnes večer",
    quickTonightSub: "Vyhliadka + chill",
    quickNearby: "Okolie",
    quickNearbySub: "Tripy okolo teba",
    quickPlan: "Naplánovať",
    quickPlanSub: "Víkendový výlet",
    sectionIdeas: "AI nápady pre teba",
    sectionIdeasMore: "Viac nápadov",
    sectionUpcoming: "Nadchádzajúce tripy",
    sectionUpcomingCalendar: "Kalendár",
    sectionLiveTrips: "Živé tripy v okolí",
    sectionLiveTripsEmpty:
      "Zatiaľ žiadne live tripy v okolí. Zapni lokalitu a skús neskôr.",
    sectionInvites: "Pozvánky",
    sectionInvitesEmpty:
      "Zatiaľ žiadne pozvánky. Pozvi priateľov na spoločný trip.",
    familyTitle: "Rodinný tip",
    familyText: "Krátky výlet s detským ihriskom a kaviarňou v blízkosti cieľa.",
    familyCta: "Rodinný trip",
    fabLabel: "Vytvoriť rýchly trip",
  },
  en: {
    greetingMorning: "Good morning",
    greetingDay: "Hey",
    greetingEvening: "Good evening",
    heroSubtitle: "Spontaneous trips, viewpoints and food on the way.",
    quickTonight: "Tonight",
    quickTonightSub: "Viewpoint + chill",
    quickNearby: "Nearby",
    quickNearbySub: "Trips around you",
    quickPlan: "Plan",
    quickPlanSub: "Weekend escape",
    sectionIdeas: "AI ideas for you",
    sectionIdeasMore: "More ideas",
    sectionUpcoming: "Upcoming trips",
    sectionUpcomingCalendar: "Calendar",
    sectionLiveTrips: "Live trips nearby",
    sectionLiveTripsEmpty:
      "No live trips nearby yet. Enable location and try again later.",
    sectionInvites: "Invites",
    sectionInvitesEmpty:
      "No invites yet. Invite friends to join your trips.",
    familyTitle: "Family tip",
    familyText: "Short trip with playground and café near the destination.",
    familyCta: "Family trip",
    fabLabel: "Create quick trip",
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

// neskôr nahradíš volaním API (napr. /ai/suggestions?userId=...)
function getAiSuggestions() {
  return SMART_SUGGESTIONS;
}

// neskôr nahradíš volaním API /live-trips?lat=..&lng=..
const LIVE_TRIPS: { id: string; title: string; distanceKm: number }[] = [];

export default function HomeScreen({ navigation }: any) {
  const trips = UPCOMING_TRIPS;
  const invites = INVITES;
  const aiSuggestions = getAiSuggestions();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return S.greetingMorning;
    if (hour < 18) return S.greetingDay;
    return S.greetingEvening;
  }, []);

  const nextTrip = trips[0];

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.subtitle}>{S.heroSubtitle}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.notifBtn,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => navigation.navigate("Inbox")}
        >
          <Ionicons name="notifications-outline" size={18} color="#E5E7EB" />
        </Pressable>
      </View>
    ),
    [greeting, navigation]
  );

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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {header}

          {/* Hero card – večerný tip alebo najbližší trip */}
          <Pressable
            onPress={() =>
              nextTrip && navigation.navigate("Trips", { id: nextTrip.id })
            }
            disabled={!nextTrip}
            style={({ pressed }) => [
              styles.heroCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}
          >
            <LinearGradient
              colors={["#0F172A", "#020617"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroText}>
                <Text style={styles.heroLabel}>{S.quickTonight}</Text>
                <Text style={styles.heroTitle}>
                  {nextTrip ? nextTrip.title : S.quickTonightSub}
                </Text>
                <Text style={styles.heroMeta}>
                  {nextTrip
                    ? `${formatDate(nextTrip.dateISO)} • ${nextTrip.place}`
                    : S.quickTonightSub}
                </Text>
              </View>
              <View style={styles.heroImageWrapper}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=60",
                  }}
                  style={styles.heroImage}
                />
              </View>
            </LinearGradient>
          </Pressable>

          {/* Quick actions */}
          <View style={styles.actionsRow}>
            <QuickAction
              icon={<Ionicons name="moon-outline" size={18} color="#F9FAFB" />}
              label={S.quickTonight}
              subtitle={S.quickTonightSub}
              onPress={() => navigation.navigate("Trips", { tonight: true })}
            />
            <QuickAction
              icon={<Ionicons name="map-outline" size={18} color="#F9FAFB" />}
              label={S.quickNearby}
              subtitle={S.quickNearbySub}
              onPress={() => navigation.navigate("Map")}
            />
          </View>

          <View style={styles.actionsRow}>
            <QuickAction
              fullWidth
              icon={
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#F9FAFB"
                />
              }
              label={S.quickPlan}
              subtitle={S.quickPlanSub}
              onPress={() => navigation.navigate("Trips")}
            />
          </View>

          {/* AI ideas */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{S.sectionIdeas}</Text>
            <Pressable onPress={() => navigation.navigate("Trips", { ai: true })}>
              <Text style={styles.sectionLink}>{S.sectionIdeasMore}</Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={aiSuggestions}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingRight: 16 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Trips", { preset: item.action?.preset })
                }
                style={({ pressed }) => [
                  styles.suggestionCard,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <View style={styles.suggestionHeader}>
                  <View style={styles.suggestionIcon}>
                    <MaterialCommunityIcons
                      name="sparkles"
                      size={16}
                      color="#FACC15"
                    />
                  </View>
                  <Text style={styles.suggestionTag}>AI</Text>
                </View>
                <Text style={styles.suggestionTitle}>{item.title}</Text>
                <Text style={styles.suggestionSub}>{item.sub}</Text>
              </Pressable>
            )}
          />

          {/* Upcoming trips */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{S.sectionUpcoming}</Text>
            <Pressable onPress={() => navigation.navigate("Trips")}>
              <Text style={styles.sectionLink}>
                {S.sectionUpcomingCalendar}
              </Text>
            </Pressable>
          </View>

          {trips.length === 0 ? (
            <EmptyRow text="Zatiaľ nemáš naplánované tripy. Skús AI nápady vyššie." />
          ) : (
            trips.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => navigation.navigate("Trips", { id: trip.id })}
                style={({ pressed }) => [
                  styles.tripCard,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.tripImageWrapper}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60",
                    }}
                    style={styles.tripCover}
                  />
                  <LinearGradient
                    colors={["#00000080", "#020617"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.tripImageOverlay}
                  />
                  <View style={styles.tripChipRow}>
                    {trip.kidsFriendly && (
                      <Badge icon="baby-carriage" label="kids" />
                    )}
                    <Badge
                      icon="account-group-outline"
                      label={`${trip.participants.length}`}
                    />
                  </View>
                </View>

                <View style={styles.tripBody}>
                  <Text style={styles.tripTitle}>{trip.title}</Text>
                  <Text style={styles.tripMeta}>
                    {formatDate(trip.dateISO)} • {trip.place} •{" "}
                    {trip.durationHrs} h
                  </Text>
                </View>
              </Pressable>
            ))
          )}

          {/* Live trips nearby – pripravené na realtime mapu */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{S.sectionLiveTrips}</Text>
            <Pressable onPress={() => navigation.navigate("Map")}>
              <Text style={styles.sectionLink}>Mapa</Text>
            </Pressable>
          </View>
          {LIVE_TRIPS.length === 0 ? (
            <EmptyRow text={S.sectionLiveTripsEmpty} />
          ) : (
            LIVE_TRIPS.map((t) => (
              <View key={t.id} style={styles.liveRow}>
                <View style={styles.liveDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.liveTitle}>{t.title}</Text>
                  <Text style={styles.liveMeta}>{t.distanceKm} km od teba</Text>
                </View>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Map", { focusTripId: t.id })
                  }
                  style={({ pressed }) => [
                    styles.liveBtn,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={styles.liveBtnText}>Detail</Text>
                </Pressable>
              </View>
            ))
          )}

          {/* Invites */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{S.sectionInvites}</Text>
            <View />
          </View>
          {invites.length === 0 ? (
            <EmptyRow text={S.sectionInvitesEmpty} />
          ) : (
            invites.map((i) => (
              <InviteRow
                key={i.id}
                invite={i}
                onAccept={() => {}}
                onDecline={() => {}}
              />
            ))
          )}

          {/* Family banner */}
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Ionicons name="sparkles-outline" size={18} color="#FBBF24" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{S.familyTitle}</Text>
              <Text style={styles.bannerText}>{S.familyText}</Text>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate("Trips", { preset: { kidsFriendly: true } })
              }
              style={styles.bannerBtn}
            >
              <Text style={styles.bannerBtnText}>{S.familyCta}</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* FAB */}
        <Pressable
          onPress={() => navigation.navigate("Trips", { quickCreate: true })}
          style={({ pressed }) => [
            styles.fab,
            pressed && { transform: [{ scale: 0.96 }] },
          ]}
          accessibilityLabel={S.fabLabel}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* === UI subcomponents === */

function QuickAction({
  icon,
  label,
  subtitle,
  onPress,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        fullWidth && { flex: 1 },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.actionIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionLabel}>{label}</Text>
        {subtitle ? (
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={16}
        color="#9CA3AF"
        style={{ marginLeft: 4 }}
      />
    </Pressable>
  );
}

function Badge({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name={icon} size={11} color="#E5E7EB" />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
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
      <View style={styles.inviteLeft}>
        <Ionicons name="person-add-outline" size={18} color="#38BDF8" />
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
          styles.inviteBtn,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.inviteBtnText}>Neskôr</Text>
      </Pressable>
      <Pressable
        onPress={onAccept}
        style={({ pressed }) => [
          styles.inviteBtnPrimary,
          pressed && { opacity: 0.9 },
        ]}
      >
        <Text style={styles.inviteBtnPrimaryText}>Pridať</Text>
      </Pressable>
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <View style={styles.emptyRow}>
      <Ionicons name="albums-outline" size={18} color="#6B7280" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

/* === styles === */

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 6,
  },
  greeting: { fontSize: 22, fontWeight: "800", color: "#F9FAFB" },
  subtitle: { opacity: 0.7, marginTop: 2, color: "#9CA3AF" },
  notifBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    padding: 10,
    borderColor: "#1F2937",
    backgroundColor: "#020617",
  },

  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
  },
  heroGradient: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  heroText: {
    flex: 1,
    paddingRight: 10,
  },
  heroLabel: {
    fontSize: 12,
    color: "#A5B4FC",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  heroMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  heroImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  action: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontWeight: "700",
    color: "#E5E7EB",
    fontSize: 14,
  },
  actionSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#F9FAFB" },
  sectionLink: {
    fontSize: 12,
    textDecorationLine: "underline",
    opacity: 0.9,
    color: "#9CA3AF",
  },

  suggestionCard: {
    width: 230,
    marginRight: 12,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  suggestionIcon: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
  },
  suggestionTag: {
    fontSize: 10,
    color: "#A5B4FC",
  },
  suggestionTitle: { fontWeight: "700", marginBottom: 2, color: "#E5E7EB" },
  suggestionSub: { fontSize: 12, opacity: 0.8, color: "#9CA3AF" },

  tripCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    marginBottom: 12,
  },
  tripImageWrapper: {
    width: "100%",
    height: 140,
    overflow: "hidden",
  },
  tripCover: {
    width: "100%",
    height: "100%",
  },
  tripImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  tripChipRow: {
    position: "absolute",
    left: 10,
    bottom: 8,
    flexDirection: "row",
  },
  tripBody: {
    padding: 12,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
    color: "#F9FAFB",
  },
  tripMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginRight: 6,
    backgroundColor: "#020617AA",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#E5E7EB",
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#111827",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#020617",
    gap: 10,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#22C55E",
  },
  liveTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  liveMeta: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  liveBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveBtnText: {
    fontSize: 11,
    color: "#E5E7EB",
  },

  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    gap: 10,
    backgroundColor: "#020617",
  },
  inviteLeft: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
  inviteTitle: { fontWeight: "700", color: "#E5E7EB" },
  inviteSub: { fontSize: 12, color: "#9CA3AF" },
  inviteBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 6,
    borderColor: "#1F2937",
  },
  inviteBtnText: { fontSize: 12, color: "#E5E7EB" },
  inviteBtnPrimary: {
    backgroundColor: "#6366F1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 6,
  },
  inviteBtnPrimaryText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 18,
    padding: 12,
    marginTop: 8,
    backgroundColor: "#020617EE",
  },
  bannerIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
  },
  bannerTitle: { fontWeight: "800", color: "#F9FAFB" },
  bannerText: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  bannerBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: "#4F46E5",
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E5E7EB",
  },

  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
    backgroundColor: "#020617",
  },
  emptyText: { fontSize: 12, color: "#9CA3AF" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 84,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
});
