import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { getCurrentProfile } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import NavLinks from "./NavLinks";
import { NAV } from "./nav";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = { title: "MAQO CMS", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  // Login page renders its own minimal shell; everything else requires a profile.
  if (!profile) {
    return (
      <html lang="en" className={`h-full antialiased ${outfit.variable}`}>
        <body className="min-h-full font-sans">{children}</body>
      </html>
    );
  }

  const items = NAV.filter((item) => item.roles.includes(profile.role));

  return (
    <html lang="en" className={`h-full antialiased ${outfit.variable}`}>
      <body className="min-h-full font-sans">
        <div className="flex min-h-screen">
          <aside className="flex w-64 shrink-0 flex-col border-r border-base-line bg-base-panel">
            <div className="border-b border-base-line px-5 py-5">
              <p className="flex items-center gap-2 text-sm font-bold text-base-ink">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-green text-[11px] font-bold text-white">M</span>
                MAQO CMS
              </p>
              <p className="mt-1.5 text-xs text-base-slate">{profile.full_name || "Internal"} · {profile.role}</p>
            </div>
            <NavLinks items={items} />
            <div className="border-t border-base-line p-3">
              <SignOutButton />
            </div>
          </aside>
          <main className="flex-1 bg-base-bg p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
