"use client";

import { usePathname } from "next/navigation";
import { NAV_ICONS } from "./navIcons";
import { NAV_CATEGORIES, type NavCategory } from "./nav";

type NavItem = { href: string; label: string; category: NavCategory };

export default function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {NAV_CATEGORIES.map((category) => {
        const group = items.filter((item) => item.category === category);
        if (group.length === 0) return null;
        return (
          <div key={category} className="pt-3 first:pt-0">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-sidebar-muted/70">{category}</p>
            {group.map((item) => {
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
          </div>
        );
      })}
    </nav>
  );
}
