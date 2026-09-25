import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

/** Leads are Malaysia-only, so this is the one country a number may be from. */
export const PHONE_COUNTRY: CountryCode = "MY";

/**
 * Validates a lead's number against Malaysia's real length rules and returns
 * it in WhatsApp's plain digit format (e.g. "60123456789"), or "" if it is
 * not a valid Malaysian number — including one typed with another "+" code.
 */
export function toLeadPhone(raw: string): string {
  const parsed = parsePhoneNumberFromString(raw, PHONE_COUNTRY);
  return parsed?.isValid() && parsed.country === PHONE_COUNTRY ? parsed.number.slice(1) : "";
}
