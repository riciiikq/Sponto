import { Invite, Trip } from "../types/trips";

export const UPCOMING_TRIPS: Trip[] = [
  {
    id: "t1",
    title: "Malé Karpaty – Pajštún",
    dateISO: new Date(Date.now() + 36e5 * 24).toISOString(),
    durationHrs: 3.5,
    place: "Borinka",
    distanceKm: 8,
    audience: "family",
    kidsFriendly: true,
    participants: [{ id: "u1", name: "Ty" }, { id: "u2", name: "Aďa" }, { id: "u3", name: "Miško" }],
    visibility: "group",
    note: "Kočík friendly úsek k vyhliadke.",
  },
  {
    id: "t2",
    title: "Záhorie – borovicové chodníky",
    dateISO: new Date(Date.now() + 36e5 * 72).toISOString(),
    durationHrs: 2,
    place: "Plavecký Štvrtok",
    audience: "friends",
    participants: [{ id: "u1", name: "Ty" }, { id: "u4", name: "Robo" }],
    visibility: "group",
  },
];

export const INVITES: Invite[] = [
  { id: "i1", fromName: "Katka", tripTitle: "Cyklovýjazd hrádza", when: "dnes, 17:30" },
  { id: "i2", fromName: "Marek", tripTitle: "Šaštín – piesky", when: "sobota 10:00" },
];

export const SMART_SUGGESTIONS = [
  { id: "s1", title: "Spontánne dnes po práci", sub: "30–90 min v okruhu 5 km", action: { type: "quick", preset: { durationHrs: 1.0, radiusKm: 5 } } },
  { id: "s2", title: "Rodinné doobeda", sub: "Kočík friendly, ihrisko na konci", action: { type: "quick", preset: { kidsFriendly: true } } },
  { id: "s3", title: "Partia – západ slnka", sub: "Vyhliadka + foto spot", action: { type: "quick", preset: { goldenHour: true } } },
];
