export type Event = {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: "Practice" | "Trip" | "Match" | "Meetup";
  summary: string;
  description: string;
  folderId: string; // Google Drive のフォルダID
};

const EVENTS: Event[] = [
  {
    slug: "2025-atami-trip",
    title: "Atami Trip",
    date: "2025-08-10",
    location: "Atami",
    type: "Trip",
    summary: "Seafood market, beach, fishing, sauna.",
    description: "Group trip with seafood focus.",
    folderId: "GOOGLE_DRIVE_FOLDER_ID_FOR_ATAMI"
  },
  {
    slug: "2025-osaka-offsite",
    title: "Osaka Off-site",
    date: "2025-12-29",
    location: "Osaka",
    type: "Meetup",
    summary: "Airbnb stay, hotpot dinner, market shopping.",
    description: "Planning and logistics, album embedded as per design.",
    folderId: "GOOGLE_DRIVE_FOLDER_ID_FOR_OSAKA"
  },
  {
    slug: "2025-scrim-nelos",
    title: "Scrim vs Nelo-S",
    date: "2025-10-05",
    location: "Online",
    type: "Match",
    summary: "Full-party practice and replay analysis.",
    description: "Practice scrim night. Replay feature notes.",
    folderId: "GOOGLE_DRIVE_FOLDER_ID_FOR_SCRIM"
  }
];

export async function listEvents() {
  return EVENTS;
}

export async function getEventBySlug(slug: string) {
  return EVENTS.find(e => e.slug === slug);
}

export async function listAnnouncements() {
  return [
    { id: "a1", date: "2025-09-20", title: "リプレイ機能の勉強会", body: "設定共有とベストプラクティスを確認" },
    { id: "a2", date: "2025-10-01", title: "大阪オフ会の計画", body: "12/29 市場で買い出し、夜は鍋予定" }
  ];
}
