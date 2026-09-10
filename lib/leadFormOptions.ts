// Single source of truth for lead form option lists, shared by the client
// component (rendering <select> options) and the server action (validating
// submissions against an allowlist instead of trusting raw form values).
export const SALUTATIONS = ["Mr", "Ms", "Mrs", "Datin", "Dato", "Dr.", "Dato' Sri", "Tun"];

export const MALAYSIAN_STATES = [
  "Selangor", "Kuala Lumpur", "Putrajaya", "Negeri Sembilan", "Melaka", "Johor",
  "Perak", "Penang", "Kedah", "Pahang", "Other",
];

export const BILL_RANGES = ["Below RM250", "RM250–500", "RM500–800", "RM800–1,500", "Above RM1,500"];

export const PROPERTY_TYPES = [
  "Terrace / Link house", "Semi-detached", "Bungalow", "Apartment / Condo (landed access)",
];

export const ELECTRIC_SUPPLY_OPTIONS = ["Single phase", "Triple phase", "Unsure"];

export const COMMUNICATION_LANGUAGES = ["English", "Chinese", "Malay"];
