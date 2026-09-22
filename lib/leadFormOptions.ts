// Single source of truth for lead form option lists, shared by the client
// component (rendering <select> options) and the server action (validating
// submissions against an allowlist instead of trusting raw form values).
export const SALUTATIONS = ["Ms", "Mr", "Mrs", "Dr.", "Dato", "Datin", "Dato' Sri", "Tun"];

export const MALAYSIAN_STATES = [
  "Selangor", "Kuala Lumpur", "Putrajaya", "Negeri Sembilan", "Melaka", "Johor",
  "Perak", "Penang", "Kedah", "Pahang", "Other",
];

export const BILL_RANGES = ["RM200 - 300", "RM300 – 400", "RM400 – 500", "RM500 – 600", "RM600 – 900", "Above RM900"];

export const PROPERTY_TYPES = [
  "Terrace / Link house", "Semi-detached", "Bungalow", "Apartment / Condo (landed access)",
];

export const ELECTRIC_SUPPLY_OPTIONS = ["Single phase", "Triple phase", "Unsure"];

export const COMMUNICATION_LANGUAGES = ["English", "Chinese", "Malay"];

// C&I only.
export const ROLE_IN_ORGANIZATION_OPTIONS = [
  "Business Owner / CEO",
  "Personal Assistant of CEO",
  "Facility Manager",
  "Finance Manager",
  "Procurement Manager",
  "Sustainability / ESG Manager",
  "Project Manager / Engineer",
  "Consultant / Advisor",
  "Contractor / Subcontractor",
  "Others",
];
