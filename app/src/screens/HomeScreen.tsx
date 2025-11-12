import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList, Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { INVITES, SMART_SUGGESTIONS, UPCOMING_TRIPS } from "../data/mockTrips";
import { Invite } from "../types/trips";

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });
  const tt = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${dd} • ${tt}`;
}

export default function HomeScreen({ navigation }: any) {
  const trips = UPCOMING_TRIPS;
  const invites = INVITES;

  // Header
  const header = useMemo(() => (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.greeting}>Ahoj 👋</Text>
        <Text style={styles.subtitle}>Pripravený na spontánny výlet?</Text>
      </View>
      <Pressable style={({ pressed }) => [styles.notifBtn, pressed && { opacity: 0.7 }]} onPress={() => navigation.navigate("Inbox")}>
        <Ionicons name="notifications-outline" size={20} />
      </Pressable>
    </View>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {header}

        {/* Quick actions */}
        <View style={styles.actions}>
          <QuickAction icon={<Ionicons name="flash-outline" size={20} />} label="Rýchly trip" onPress={() => navigation.navigate("Trips")} />
          <QuickAction icon={<Ionicons name="compass-outline" size={20} />} label="Okolie" onPress={() => navigation.navigate("Map")} />
          <QuickAction icon={<Ionicons name="people-outline" size={20} />} label="Pozvať" onPress={() => navigation.navigate("Inbox")} />
        </View>

        {/* Smart suggestions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spontánne nápady</Text>
          <Pressable><Text style={styles.sectionLink}>Zobraziť viac</Text></Pressable>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SMART_SUGGESTIONS}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate("Trips", { preset: item.action?.preset })}
              style={({ pressed }) => [styles.suggestionCard, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.suggestionIcon}><MaterialCommunityIcons name="star-four-points-outline" size={18} /></View>
              <Text style={styles.suggestionTitle}>{item.title}</Text>
              <Text style={styles.suggestionSub}>{item.sub}</Text>
            </Pressable>
          )}
        />

        {/* Upcoming trips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nadchádzajúce tripy</Text>
          <Pressable onPress={() => navigation.navigate("Trips")}><Text style={styles.sectionLink}>Kalendár</Text></Pressable>
        </View>

        {trips.map((trip) => (
          <Pressable key={trip.id} onPress={() => navigation.navigate("Trips", { id: trip.id })} style={({ pressed }) => [styles.tripCard, pressed && { opacity: 0.8 }]}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1508766206392-8bd5cf550d1b?w=1200&q=60" }}
              style={styles.tripCover}
            />
            <View style={styles.tripBody}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                {trip.kidsFriendly && <Badge icon="baby-carriage" label="kids" />}
                <Badge icon="account-group-outline" label={`${trip.participants.length}`} />
              </View>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripMeta}>{formatDate(trip.dateISO)} • {trip.place} • {trip.durationHrs} h</Text>
            </View>
          </Pressable>
        ))}

        {/* Invites */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pozvánky</Text>
          <View />
        </View>
        {invites.length === 0 ? (
          <EmptyRow text="Zatiaľ žiadne pozvánky. Pozvi priateľov na trip." />
        ) : invites.map((i) => <InviteRow key={i.id} invite={i} onAccept={() => {}} onDecline={() => {}} />)}

        {/* Family banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}><Ionicons name="sparkles-outline" size={20} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Tip pre rodiny</Text>
            <Text style={styles.bannerText}>Ihrisko + kaviareň v blízkosti cieľa. Skús „Rodinné doobeda“.</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Trips", { preset: { kidsFriendly: true } })} style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Vyskúšať</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* FAB – rýchly trip */}
      <Pressable
        onPress={() => navigation.navigate("Trips", { quickCreate: true })}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}
        accessibilityLabel="Vytvoriť rýchly trip"
      >
        <Ionicons name="add" size={24} />
      </Pressable>
    </SafeAreaView>
  );
}

/** UI podsúčať */
function QuickAction({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
      <View style={styles.actionIcon}>{icon}</View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function Badge({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name={icon} size={12} />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function InviteRow({ invite, onAccept, onDecline }: { invite: Invite; onAccept: () => void; onDecline: () => void }) {
  return (
    <View style={styles.inviteRow}>
      <View style={styles.inviteLeft}>
        <Ionicons name="person-add-outline" size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.inviteTitle}>{invite.fromName} ťa pozýva</Text>
        <Text style={styles.inviteSub}>{invite.tripTitle} • {invite.when}</Text>
      </View>
      <Pressable onPress={onDecline} style={({ pressed }) => [styles.inviteBtn, pressed && { opacity: 0.7 }]}>
        <Text style={styles.inviteBtnText}>Neskôr</Text>
      </Pressable>
      <Pressable onPress={onAccept} style={({ pressed }) => [styles.inviteBtnPrimary, pressed && { opacity: 0.9 }]}>
        <Text style={styles.inviteBtnPrimaryText}>Pridať</Text>
      </Pressable>
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <View style={styles.emptyRow}>
      <Ionicons name="albums-outline" size={20} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  greeting: { fontSize: 22, fontWeight: "800" },
  subtitle: { opacity: 0.7, marginTop: 2 },
  notifBtn: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: 10 },

  actions: { flexDirection: "row", gap: 12, marginTop: 12, marginBottom: 6 },
  action: { flex: 1, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  actionIcon: { marginBottom: 6 },
  actionLabel: { fontWeight: "700" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  sectionLink: { fontSize: 12, textDecorationLine: "underline", opacity: 0.8 },

  suggestionCard: { width: 220, marginRight: 12, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 12 },
  suggestionIcon: { width: 28, height: 28, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  suggestionTitle: { fontWeight: "700", marginBottom: 2 },
  suggestionSub: { fontSize: 12, opacity: 0.75 },

  tripCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 18, overflow: "hidden", marginBottom: 12 },
  tripCover: { width: "100%", height: 140 },
  tripBody: { padding: 12 },
  tripTitle: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  tripMeta: { fontSize: 12, opacity: 0.75 },

  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: "700" },

  inviteRow: { flexDirection: "row", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 12, marginBottom: 10, gap: 10 },
  inviteLeft: { width: 28, height: 28, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  inviteTitle: { fontWeight: "700" },
  inviteSub: { fontSize: 12, opacity: 0.7 },
  inviteBtn: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginLeft: 6 },
  inviteBtnText: { fontSize: 12 },
  inviteBtnPrimary: { backgroundColor: "black", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 6 },
  inviteBtnPrimaryText: { fontSize: 12, color: "white", fontWeight: "700" },

  banner: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 12, marginTop: 6 },
  bannerIcon: { width: 28, height: 28, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  bannerTitle: { fontWeight: "800" },
  bannerText: { fontSize: 12, opacity: 0.75 },
  bannerBtn: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  bannerBtnText: { fontSize: 12, fontWeight: "700" },

  emptyRow: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: 12, marginTop: 4 },
  emptyText: { fontSize: 12, opacity: 0.7 },

  fab: { position: "absolute", right: 16, bottom: 84, width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth, backgroundColor: "white" },
});
