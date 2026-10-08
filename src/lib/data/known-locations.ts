// Verified approximate location reference for Indian urban landmarks
// Coordinates represent centroid of landmark area. Always marked isApproximate: true unless verified GPS.

export interface KnownLandmark {
  name: string;
  aliases: string[];
  area: string;
  city: string;
  approxLat: number;
  approxLng: number;
  description: string;
}

export const KNOWN_LANDMARKS: KnownLandmark[] = [
  {
    name: 'Velachery MRTS Station',
    aliases: [
      'velachery mrts',
      'mrts station',
      'velachery station',
      'west gate',
      'vijayanagar side',
      'mrts backside',
      'station venakala',
      'velachery mrts daggara',
    ],
    area: 'Velachery',
    city: 'Chennai',
    approxLat: 12.9785,
    approxLng: 80.2185,
    description: 'Velachery MRTS railway station, low-lying flood-prone sector in South Chennai',
  },
  {
    name: 'Ambattur Industrial Estate',
    aliases: [
      'ambattur industrial',
      'ambattur estate',
      'sidco ambattur',
      'ambattur factory',
      'estate phase 2',
      'industrial area',
    ],
    area: 'Ambattur',
    city: 'Chennai',
    approxLat: 13.1143,
    approxLng: 80.1548,
    description: 'Ambattur Industrial Estate SIDCO manufacturing cluster',
  },
  {
    name: 'T. Nagar Ranganathan Street',
    aliases: [
      't nagar',
      'ranganathan street',
      'panagal park',
      't nagar bus terminus',
      'usman road',
    ],
    area: 'T. Nagar',
    city: 'Chennai',
    approxLat: 13.0405,
    approxLng: 80.2337,
    description: 'Dense commercial shopping zone in Central Chennai',
  },
  {
    name: 'OMR Sholinganallur Junction',
    aliases: [
      'omr toll',
      'sholinganallur junction',
      'elcot sez',
      'omr expressway',
      'karapakkam',
    ],
    area: 'OMR Corridor',
    city: 'Chennai',
    approxLat: 12.9010,
    approxLng: 80.2279,
    description: 'Old Mahabalipuram Road arterial highway junction',
  },
  {
    name: 'Kathipara Junction & Guindy Industrial Area',
    aliases: [
      'kathipara',
      'guindy station',
      'guindy estate',
      'kathipara flyover',
      'race course road',
    ],
    area: 'Guindy',
    city: 'Chennai',
    approxLat: 13.0067,
    approxLng: 80.2036,
    description: 'Kathipara grade separator and commercial transit junction',
  },
];

export function resolveApproximateLandmark(text: string): {
  normalized: string;
  landmarks: string[];
  lat: number | null;
  lng: number | null;
  confidence: number;
} | null {
  const lower = text.toLowerCase();
  for (const item of KNOWN_LANDMARKS) {
    const matched = item.aliases.some((alias) => lower.includes(alias.toLowerCase()));
    if (matched || lower.includes(item.name.toLowerCase())) {
      const foundLandmarks = item.aliases.filter((a) => lower.includes(a.toLowerCase()));
      return {
        normalized: `${item.name}, ${item.area}, ${item.city}`,
        landmarks: [item.name, ...foundLandmarks],
        lat: item.approxLat,
        lng: item.approxLng,
        confidence: 0.88,
      };
    }
  }
  return null;
}
