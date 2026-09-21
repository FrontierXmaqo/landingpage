/**
 * Malaysian postcode -> state, district and town.
 *
 * The lead forms capture a postcode because "Selangor" on its own is too
 * coarse to act on: Puchong and Sabak Bernam are the same row in a by-state
 * chart but a two-hour drive apart for a site visit.
 *
 * Kept as plain range tables rather than stored columns on the lead rows, so a
 * wrong mapping is a one-line fix here instead of a data migration.
 *
 * NOTE FOR REVIEW: the state ranges are the standard national allocation and
 * are safe. The Selangor district assignments below are the ones worth a
 * sanity check by someone who knows the ground — Seri Kembangan and Serdang
 * (Petaling vs Sepang), Ampang (Gombak vs Hulu Langat) and Bandar Puncak Alam
 * (Kuala Selangor vs Klang) all sit on district boundaries. An unrecognised
 * postcode degrades to state-only rather than guessing.
 */

export type PostcodeArea = {
  postcode: string;
  state: string;
  /** Only populated for Selangor, KL and Putrajaya — where we report in detail. */
  district?: string;
  town?: string;
};

type Range = { from: number; to: number; state: string };

/** National allocation: every postcode resolves to at least a state. */
const STATE_RANGES: Range[] = [
  { from: 1000, to: 2999, state: "Perlis" },
  { from: 5000, to: 9999, state: "Kedah" },
  { from: 10000, to: 14999, state: "Penang" },
  { from: 15000, to: 18999, state: "Kelantan" },
  { from: 20000, to: 24999, state: "Terengganu" },
  { from: 25000, to: 28999, state: "Pahang" },
  { from: 30000, to: 36999, state: "Perak" },
  { from: 39000, to: 39999, state: "Pahang" },
  { from: 40000, to: 48999, state: "Selangor" },
  { from: 49000, to: 49999, state: "Pahang" },
  { from: 50000, to: 60999, state: "Kuala Lumpur" },
  { from: 62000, to: 62999, state: "Putrajaya" },
  { from: 63000, to: 64999, state: "Selangor" },
  { from: 68000, to: 68999, state: "Selangor" },
  { from: 69000, to: 69999, state: "Pahang" },
  { from: 70000, to: 73999, state: "Negeri Sembilan" },
  { from: 75000, to: 78999, state: "Melaka" },
  { from: 79000, to: 86999, state: "Johor" },
  { from: 87000, to: 87999, state: "Labuan" },
  { from: 88000, to: 91999, state: "Sabah" },
  { from: 93000, to: 98999, state: "Sarawak" },
];

type AreaRange = { from: number; to: number; district: string; town: string };

/** Selangor, at the granularity the sales team actually routes on. */
const SELANGOR_AREAS: AreaRange[] = [
  { from: 40000, to: 40999, district: "Petaling", town: "Shah Alam" },
  { from: 41000, to: 41999, district: "Klang", town: "Klang" },
  { from: 42000, to: 42199, district: "Klang", town: "Port Klang" },
  { from: 42200, to: 42299, district: "Klang", town: "Kapar" },
  { from: 42300, to: 42399, district: "Kuala Selangor", town: "Bandar Puncak Alam" },
  { from: 42400, to: 42499, district: "Klang", town: "Klang" },
  { from: 42500, to: 42599, district: "Kuala Langat", town: "Telok Panglima Garang" },
  { from: 42600, to: 42699, district: "Kuala Langat", town: "Jenjarom" },
  { from: 42700, to: 42799, district: "Kuala Langat", town: "Banting" },
  { from: 42800, to: 42899, district: "Kuala Langat", town: "Tanjong Sepat" },
  { from: 42900, to: 42999, district: "Sepang", town: "Sepang" },
  { from: 43000, to: 43099, district: "Hulu Langat", town: "Kajang" },
  { from: 43100, to: 43199, district: "Hulu Langat", town: "Hulu Langat" },
  { from: 43200, to: 43299, district: "Hulu Langat", town: "Cheras" },
  { from: 43300, to: 43399, district: "Petaling", town: "Seri Kembangan" },
  { from: 43400, to: 43499, district: "Petaling", town: "Serdang" },
  { from: 43500, to: 43599, district: "Hulu Langat", town: "Semenyih" },
  { from: 43600, to: 43699, district: "Hulu Langat", town: "Bandar Baru Bangi" },
  { from: 43700, to: 43799, district: "Hulu Langat", town: "Beranang" },
  { from: 43800, to: 43899, district: "Sepang", town: "Dengkil" },
  { from: 43900, to: 43999, district: "Sepang", town: "Sepang" },
  { from: 44000, to: 44999, district: "Hulu Selangor", town: "Kuala Kubu Bharu" },
  { from: 45000, to: 45299, district: "Kuala Selangor", town: "Kuala Selangor" },
  { from: 45300, to: 45499, district: "Sabak Bernam", town: "Sungai Besar" },
  { from: 45500, to: 45999, district: "Kuala Selangor", town: "Tanjong Karang" },
  { from: 46000, to: 46999, district: "Petaling", town: "Petaling Jaya" },
  { from: 47000, to: 47099, district: "Petaling", town: "Sungai Buloh" },
  { from: 47100, to: 47199, district: "Petaling", town: "Puchong" },
  { from: 47200, to: 47499, district: "Petaling", town: "Petaling Jaya" },
  { from: 47500, to: 47699, district: "Petaling", town: "Subang Jaya" },
  { from: 47700, to: 47799, district: "Petaling", town: "Petaling Jaya" },
  { from: 47800, to: 47899, district: "Petaling", town: "Kota Damansara" },
  { from: 47900, to: 47999, district: "Petaling", town: "Petaling Jaya" },
  { from: 48000, to: 48099, district: "Gombak", town: "Rawang" },
  { from: 48100, to: 48199, district: "Gombak", town: "Batu Arang" },
  { from: 48200, to: 48299, district: "Gombak", town: "Serendah" },
  { from: 48300, to: 48999, district: "Gombak", town: "Rawang" },
  { from: 63000, to: 63999, district: "Sepang", town: "Cyberjaya" },
  { from: 64000, to: 64999, district: "Sepang", town: "Sepang" },
  { from: 68000, to: 68099, district: "Gombak", town: "Ampang" },
  { from: 68100, to: 68999, district: "Gombak", town: "Batu Caves" },
];

/** Kuala Lumpur, coarser — one district, recognisable localities. */
const KL_AREAS: AreaRange[] = [
  { from: 50000, to: 50999, district: "Kuala Lumpur", town: "City Centre" },
  { from: 51000, to: 51999, district: "Kuala Lumpur", town: "Sentul" },
  { from: 52000, to: 52999, district: "Kuala Lumpur", town: "Kepong" },
  { from: 53000, to: 53999, district: "Kuala Lumpur", town: "Setapak" },
  { from: 54000, to: 54999, district: "Kuala Lumpur", town: "Setiawangsa" },
  { from: 55000, to: 55999, district: "Kuala Lumpur", town: "Ampang / Maluri" },
  { from: 56000, to: 56999, district: "Kuala Lumpur", town: "Cheras" },
  { from: 57000, to: 57999, district: "Kuala Lumpur", town: "Sungai Besi / Bukit Jalil" },
  { from: 58000, to: 58999, district: "Kuala Lumpur", town: "Old Klang Road" },
  { from: 59000, to: 59999, district: "Kuala Lumpur", town: "Bangsar / Mid Valley" },
  { from: 60000, to: 60999, district: "Kuala Lumpur", town: "Kuala Lumpur" },
];

function find<T extends { from: number; to: number }>(ranges: T[], n: number) {
  return ranges.find((r) => n >= r.from && n <= r.to);
}

/** Null for anything that isn't five digits or falls outside the allocation. */
export function lookupPostcode(postcode: string | null | undefined): PostcodeArea | null {
  if (!postcode || !/^[0-9]{5}$/.test(postcode)) return null;
  const n = Number(postcode);

  const stateRange = find(STATE_RANGES, n);
  if (!stateRange) return null;

  const area =
    stateRange.state === "Selangor"
      ? find(SELANGOR_AREAS, n)
      : stateRange.state === "Kuala Lumpur"
        ? find(KL_AREAS, n)
        : stateRange.state === "Putrajaya"
          ? { district: "Putrajaya", town: "Putrajaya" }
          : undefined;

  return { postcode, state: stateRange.state, district: area?.district, town: area?.town };
}

/**
 * The location a lead should be counted under. Prefers the postcode, because
 * the state dropdown is self-reported and the postcode is checkable; falls
 * back to the dropdown for every lead captured before the field existed.
 */
export function leadLocation(lead: { postcode?: string | null; state?: string | null }) {
  const area = lookupPostcode(lead.postcode);
  return {
    state: area?.state ?? lead.state ?? "Unknown",
    district: area?.district ?? null,
    town: area?.town ?? null,
    hasDetail: Boolean(area?.district),
  };
}
