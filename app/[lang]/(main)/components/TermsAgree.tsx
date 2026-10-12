import { PRIVACY_POLICY } from "@/lib/privacyPolicy";
import { TERMS_CONDITIONS } from "@/lib/termsConditions";
import { localePath, type Locale } from "@/lib/i18n";

/** Required "I agree to the Terms & Conditions and Privacy Policy" tick box.
 *  submitLead rejects a lead without terms_accepted=yes. Inline layout styles
 *  so it also works on the EV page, which has its own stylesheet. */
export default function TermsAgree({ locale, className, linkClassName }: { locale: Locale; className?: string; linkClassName?: string }) {
  const [before, between, after] = TERMS_CONDITIONS[locale].agree;
  return (
    <label className={className} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", cursor: "pointer" }}>
      <input type="checkbox" name="terms_accepted" value="yes" required style={{ flex: "none", width: "1rem", height: "1rem", marginTop: "0.15em" }} />
      <span>
        {before}
        <a href={localePath(locale, "/terms")} target="_blank" className={linkClassName}>{TERMS_CONDITIONS[locale].footerLink}</a>
        {between}
        <a href={localePath(locale, "/privacy")} target="_blank" className={linkClassName}>{PRIVACY_POLICY[locale].footerLink}</a>
        {after}
      </span>
    </label>
  );
}
