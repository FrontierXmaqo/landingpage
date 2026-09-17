"use client";

import { usePathname } from "next/navigation";
import { NAV_ICONS } from "./navIcons";

type NavItem = { href: string; label: string };

export default function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = NAV_ICONS[item.href];
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              active
                ? "bg-brand-green text-white shadow-sm"
                : "text-sidebar-muted hover:bg-sidebar-bg-raised hover:text-sidebar-ink"
            }`}
          >
            {Icon && <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-sidebar-muted"}`} />}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
