import { CONTACT, FOOTER_LINKS, TAGLINE, CREDENTIALS } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">MAQO Engineering Sdn Bhd</p>
            <p className="mt-2 text-sm text-slate-500">{TAGLINE}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {CREDENTIALS.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {FOOTER_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-slate-800">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Email: {CONTACT.email}</li>
              <li>Office: {CONTACT.office}</li>
              <li>
                WhatsApp:{" "}
                <a href={CONTACT.whatsappHref} className="hover:text-slate-800">
                  {CONTACT.whatsapp}
                </a>
              </li>
              <li>{CONTACT.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 MAQO Engineering Sdn Bhd (MAQO Solar / MAQO Technologies). All rights reserved.</span>
          <span>Suruhanjaya Tenaga · SEDA · CIDB G7</span>
        </div>
      </div>
    </footer>
  );
}
