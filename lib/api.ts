export async function fetchUpcomingTrips() {
  await new Promise(r => setTimeout(r, 400));
  return [
    { id: "t1", title: "Piatkový Night Ride", date: "Fri 21:00" },
    { id: "t2", title: "McDrive & Vyhliadka", date: "Sat 20:30" },
  ];
}
