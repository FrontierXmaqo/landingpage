"use client";

import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

export default function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 px-3 py-4">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              active
                ? "bg-brand-green-tint text-brand-green-ink"
                : "text-base-ink hover:bg-brand-green-tint/60 hover:text-brand-green-ink"
            }`}
          >
            {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-brand-green" aria-hidden />}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
