// src/screens/HomeScreen.tsx (alebo app/src/screens/HomeScreen.tsx)
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

export default function HomeScreen({ navigation }: any) {
  const trips = UPCOMING_TRIPS;
  const invites = INVITES;

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Ahoj 👋</Text>
          <Text style={styles.subtitle}>Pripravený na spontánny výlet?</Text>
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
    [navigation]
  );

  return (
    <LinearGradient
      colors={["#05001A", "#05001A", "#020617"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Jemné glow pozadie */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {header}

          {/* Quick actions */}
          <View style={styles.actions}>
            <QuickAction
              icon={<Ionicons name="flash-outline" size={20} color="#F9FAFB" />}
              label="Rýchly trip"
              subtitle="Do pár minút"
              onPress={() => navigation.navigate("Trips")}
              accent="#F97316"
            />
            <QuickAction
              icon={<Ionicons name="compass-outline" size={20} color="#F9FAFB" />}
              label="Okolie"
              subtitle="Tipy v blízkosti"
              onPress={() => navigation.navigate("Map")}
              accent="#22C55E"
            />
          </View>
          <View style={styles.actionsSecondRow}>
            <QuickAction
              icon={<Ionicons name="people-outline" size={20} color="#F9FAFB" />}
              label="Pozvať partiu"
              subtitle="Spoj kamošov"
              onPress={() => navigation.navigate("Inbox")}
              accent="#38BDF8"
              fullWidth
            />
          </View>

          {/* Smart suggestions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spontánne nápady</Text>
            <Pressable>
              <Text style={styles.sectionLink}>Zobraziť viac</Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SMART_SUGGESTIONS}
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
                <View style={styles.suggestionIcon}>
                  <MaterialCommunityIcons
                    name="star-four-points-outline"
                    size={18}
                    color="#FACC15"
                  />
                </View>
                <Text style={styles.suggestionTitle}>{item.title}</Text>
                <Text style={styles.suggestionSub}>{item.sub}</Text>
              </Pressable>
            )}
          />

          {/* Upcoming trips */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nadchádzajúce tripy</Text>
            <Pressable onPress={() => navigation.navigate("Trips")}>
              <Text style={styles.sectionLink}>Kalendár</Text>
            </Pressable>
          </View>

          {trips.length === 0 ? (
            <EmptyRow text="Zatiaľ nemáš naplánované žiadne tripy." />
          ) : (
            trips.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => navigation.navigate("Trips", { id: trip.id })}
                style={({ pressed }) => [
                  styles.tripCard,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <View style={styles.tripImageWrapper}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1508766206392-8bd5cf550d1b?w=1200&q=60",
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

          {/* Invites */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pozvánky</Text>
            <View />
          </View>
          {invites.length === 0 ? (
            <EmptyRow text="Zatiaľ žiadne pozvánky. Pozvi priateľov na trip." />
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
              <Text style={styles.bannerTitle}>Tip pre rodiny</Text>
              <Text style={styles.bannerText}>
                Ihrisko + kaviareň v blízkosti cieľa. Skús „Rodinné doobeda“.
              </Text>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate("Trips", { preset: { kidsFriendly: true } })
              }
              style={styles.bannerBtn}
            >
              <Text style={styles.bannerBtnText}>Vyskúšať</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* FAB – rýchly trip */}
        <Pressable
          onPress={() => navigation.navigate("Trips", { quickCreate: true })}
          style={({ pressed }) => [
            styles.fab,
            pressed && { transform: [{ scale: 0.96 }] },
          ]}
          accessibilityLabel="Vytvoriť rýchly trip"
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
  accent,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
  accent: string;
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        fullWidth && { flex: 1.7 },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.actionAccent, { backgroundColor: accent }]} />
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
    marginBottom: 14,
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

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  actionsSecondRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  action: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionAccent: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 999,
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
    marginTop: 2,
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
  suggestionIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    marginBottom: 8,
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
    height: 150,
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
