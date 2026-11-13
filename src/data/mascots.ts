// The 20 collectible kangaroo jerseys. Each is unlocked by an achievement.
// (Unlock-gating activates with the backend; for now all are previewable.)

export interface Mascot {
  id: string;
  name: string;
  img: string; // served from /public/jerseys
  achievement: string;
}

export const MASCOTS: Mascot[] = [
  { id: "default", name: "Plain Whites", img: "/jerseys/Default.png", achievement: "Your starting kit" },
  { id: "flops", name: "Unlucknow Super Flops", img: "/jerseys/UnlocknowSuperFlops.png", achievement: "Score a Duck" },
  { id: "pathetic", name: "Pretty Pathetic Kings", img: "/jerseys/PrettyPatheticKings.png", achievement: "Score a Single" },
  { id: "gujratty", name: "Gujratty Moody Titans", img: "/jerseys/GujrattyMoodyTitans.png", achievement: "Score a Boundary" },
  { id: "hyderabaddie", name: "Sunsets Hyderabaddie", img: "/jerseys/SunsetsHyderabaddie.png", achievement: "Score a Six" },
  { id: "ambany", name: "Aambany Indiyans", img: "/jerseys/AmbanyIndiyans.png", achievement: "Score a Century" },
  { id: "chennay", name: "Chennay Two-Year Kings", img: "/jerseys/ChennayTwoYearKings.png", achievement: "Reach Club level" },
  { id: "arajastan", name: "Araj-astan Royals", img: "/jerseys/ArajasthanRoyals.png", achievement: "Reach County level" },
  { id: "delly", name: "Delly Smogitals", img: "/jerseys/DellySmogitals.png", achievement: "Reach Ranji level" },
  { id: "kolkaty", name: "Kolkaty Khan't Quit Smoking Riders", img: "/jerseys/KolkatyKhantQuitSmokingRiders.png", achievement: "Reach IPL level" },
  { id: "india", name: "India", img: "/jerseys/India.png", achievement: "Reach International level" },
  { id: "srilanka", name: "Sri Lanka", img: "/jerseys/SriLanka.png", achievement: "3-day streak" },
  { id: "westindies", name: "West Indies", img: "/jerseys/WestIndies.png", achievement: "7-day streak" },
  { id: "bangladesh", name: "Bangladesh", img: "/jerseys/Bangladesh.png", achievement: "14-day streak" },
  { id: "england", name: "England", img: "/jerseys/England.png", achievement: "30-day streak" },
  { id: "newzealand", name: "New Zealand", img: "/jerseys/NewZealand.png", achievement: "Score 250+ in a day" },
  { id: "australia", name: "Australia", img: "/jerseys/Australia.png", achievement: "Score 400+ in a day" },
  { id: "royal49", name: "Royal 49 Challengers", img: "/jerseys/Royal49Challengers.png", achievement: "Score 440+ in a day" },
  { id: "southafrica", name: "South Africa", img: "/jerseys/SouthAfrica.png", achievement: "Boundary+ on all 5 in a day" },
  { id: "gold", name: "Gold GOAT", img: "/jerseys/GoldKit.png", achievement: "Collect all 19 other jerseys" },
];

export const DEFAULT_MASCOT_ID = "default";

export function mascotById(id: string): Mascot {
  return MASCOTS.find((m) => m.id === id) ?? MASCOTS[0];
}
