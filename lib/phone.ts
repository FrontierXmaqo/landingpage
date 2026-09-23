import { isSupportedCountry, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export const DEFAULT_PHONE_COUNTRY: CountryCode = "MY";

/** The posted country, or Malaysia when it is missing or not one libphonenumber knows. */
export function toPhoneCountry(value: string): CountryCode {
  return isSupportedCountry(value) ? value : DEFAULT_PHONE_COUNTRY;
}

/**
 * Validates a lead's number against its country's real length rules and
 * returns it in WhatsApp's plain digit format (e.g. "60123456789"), or "" if
 * it is not a possible number there. A number typed with its own "+" code
 * wins over the picker, since that is what the visitor actually wrote.
 */
export function toLeadPhone(raw: string, country: CountryCode): string {
  const parsed = parsePhoneNumberFromString(raw, country);
  return parsed?.isValid() ? parsed.number.slice(1) : "";
}
