export type TripVisibility = "private" | "group" | "public";
export type TripAudience = "family" | "friends" | "couple" | "solo";
export type Trip = {
  id: string;
  title: string;
  dateISO: string;            // začiatok
  durationHrs: number;
  place: string;
  distanceKm?: number;
  audience: TripAudience;
  kidsFriendly?: boolean;
  participants: { id: string; name: string; avatar?: string }[];
  visibility: TripVisibility;
  note?: string;
};
export type Invite = {
  id: string;
  fromName: string;
  tripTitle: string;
  when: string;               // „sobota 10:00“
};
