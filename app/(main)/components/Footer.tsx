import { CONTACT, FOOTER_LINKS, TAGLINE, CREDENTIALS } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-base-line bg-base-panel py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-base-ink">MAQO Engineering Sdn Bhd</p>
            <p className="mt-2 text-sm text-base-slate">{TAGLINE}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-base-slate">
              {CREDENTIALS.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-base-ink">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-base-slate">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-base-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-base-ink">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-base-slate">
              <li>
                Email:{" "}
                <a href={CONTACT.emailHref} className="hover:text-base-ink">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                Office:{" "}
                <a href={CONTACT.officeHref} className="hover:text-base-ink">
                  {CONTACT.office}
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-base-ink"
                >
                  {CONTACT.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-base-ink"
                >
                  {CONTACT.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-base-line pt-6 text-xs text-base-slate sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 MAQO Engineering Sdn Bhd (MAQO Solar / MAQO Technologies). All rights reserved.</span>
          <span>Suruhanjaya Tenaga · SEDA · CIDB G7</span>
        </div>
      </div>
    </footer>
  );
}
