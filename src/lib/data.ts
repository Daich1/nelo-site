export type Event = {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: "Practice" | "Trip" | "Match" | "Meetup";
  summary: string;
  description: string;
  images: string[];
};

const demoImages = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "https://images.unsplash.com/photo-1520975593861-230c439cec33"
];

const EVENTS: Event[] = [
  {
    slug: "2025-atami-trip",
    title: "Atami Trip",
    date: "2025-08-10",
    location: "Atami",
    type: "Trip",
    summary: "Seafood market, beach, fishing, sauna.",
    description: "Group trip with seafood focus. Album is accessible from this page only.",
    images: demoImages
  },
  {
    slug: "2025-osaka-offsite",
    title: "Osaka Off-site",
    date: "2025-12-29",
    location: "Osaka",
    type: "Meetup",
    summary: "Airbnb stay, hotpot dinner, market shopping.",
    description: "Planning and logistics, album embedded as per design.",
    images: demoImages.slice().reverse()
  },
  {
    slug: "2025-scrim-nelos",
    title: "Scrim vs Nelo-S",
    date: "2025-10-05",
    location: "Online",
    type: "Match",
    summary: "Full-party practice and replay analysis.",
    description: "Practice scrim night. Replay feature notes.",
    images: demoImages
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
    { id: "a1", date: "2025-09-20", title: "Replay feature study", body: "Share configs and best practices." },
    { id: "a2", date: "2025-10-01", title: "Osaka off-site planning", body: "Market on Dec 29, dinner hotpot." }
  ];
}
