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
  const initials = (profile.full_name || profile.role)
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <html lang="en" className={`h-full antialiased ${outfit.variable}`}>
      <body className="min-h-full font-sans">
        <div className="flex min-h-screen items-start">
          {/* Pinned: the CMS pages are long (the C&I editor runs to a dozen project
              cards), and the nav used to scroll away with them. Sticky rather than
              fixed so it still sits in the flex row, and it scrolls internally if a
              short window cannot fit every link. */}
          <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-sidebar-bg">
            <div className="shrink-0 border-b border-sidebar-line px-5 py-5">
              <p className="flex items-center gap-2 text-sm font-bold text-sidebar-ink">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-green text-[11px] font-bold text-white">M</span>
                MAQO CMS
              </p>
            </div>
            <NavLinks items={items} />
            <div className="flex shrink-0 items-center gap-2.5 border-t border-sidebar-line p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-bg-raised text-xs font-semibold text-sidebar-ink">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-ink">{profile.full_name || "Internal"}</p>
                <p className="truncate text-xs capitalize text-sidebar-muted">{profile.role}</p>
              </div>
              <SignOutButton />
            </div>
          </aside>
          <main className="flex-1 bg-base-bg p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
