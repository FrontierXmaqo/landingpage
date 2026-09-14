import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { getCurrentProfile, type Role } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = { title: "MAQO CMS", robots: { index: false, follow: false } };

const NAV: { href: string; label: string; roles: Role[] }[] = [
  { href: "/admin", label: "Overview", roles: ["admin", "marketing", "sales"] },
  { href: "/admin/calculator", label: "Solar Calculator Settings", roles: ["admin", "marketing"] },
  { href: "/admin/leads-form", label: "Lead Form", roles: ["admin", "marketing"] },
  { href: "/admin/enquiries", label: "Customer Enquiries", roles: ["admin", "sales"] },
  { href: "/admin/analytics", label: "Performance Analytics", roles: ["admin", "marketing", "sales"] },
  { href: "/admin/users", label: "User Management", roles: ["admin"] },
];

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
              <p className="text-sm font-bold text-base-ink">MAQO CMS</p>
              <p className="mt-0.5 text-xs text-base-slate">{profile.full_name || "Internal"} · {profile.role}</p>
            </div>
            <nav className="flex-1 space-y-0.5 px-3 py-4">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-base-ink transition-colors duration-150 hover:bg-brand-green-tint hover:text-brand-green-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
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
