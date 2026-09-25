"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import s from "./SiteMenu.module.css";

export type SiteMenuItem = {
  label: string;
  href: string;
  /** Which page's colour the row fills with on hover (see SiteMenu.module.css). */
  theme: "residential" | "ci" | "bess" | "ev" | "atap" | "about" | "default";
  /** The solution pages get a coloured dot and sit above the divider. */
  dot?: boolean;
};

/**
 * The header's menu. Three lines that spread on hover; open, they pull in and
 * a sun takes their place. With a mouse it opens on hover and closes shortly
 * after the pointer leaves the button and panel; touch and keyboard open it
 * on tap/Enter. Escape or a click outside closes it.
 */
export default function SiteMenu({ label, items }: { label: string; items: SiteMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // A hover opens the menu ~260ms in, which is about when a quick clicker's
  // click lands; without this, that click would close what hover just opened.
  const hoverOpenedAt = useRef(0);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    if (!open)
      timer.current = setTimeout(() => {
        hoverOpenedAt.current = Date.now();
        setOpen(true);
      }, 260);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 300);
  };
  const onClick = () => {
    clearTimeout(timer.current);
    if (open && Date.now() - hoverOpenedAt.current < 600) return;
    setOpen(!open);
  };

  const solutions = items.filter((i) => i.dot);
  const rest = items.filter((i) => !i.dot);
  const row = (item: SiteMenuItem, i: number) => (
    <Link
      key={item.href}
      href={item.href}
      className={`${s.link} ${s[item.theme]} ${item.dot ? "" : s.plain}`}
      style={{ "--i": i } as CSSProperties}
      onClick={() => setOpen(false)}
    >
      {item.dot && <i className={s.dot} aria-hidden="true" />}
      {item.label}
    </Link>
  );

  return (
    <div ref={root} className={s.root} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <button
        ref={button}
        type="button"
        className={s.btn}
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onClick}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" aria-hidden="true">
          <path className={`${s.l} ${s.l1}`} d="M4 8h16" strokeWidth="2" />
          <path className={`${s.l} ${s.l2}`} d="M4 12h16" strokeWidth="2" />
          <path className={`${s.l} ${s.l3}`} d="M4 16h16" strokeWidth="2" />
          <g className={s.rays} strokeWidth="2">
            <path d="M12 1.5v2.4M12 20.1v2.4M1.5 12h2.4M20.1 12h2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
          </g>
          <circle className={s.disc} cx="12" cy="12" r="4.4" />
        </svg>
        {open && <span className={s.spark} aria-hidden="true" />}
      </button>
      {open && (
        <nav id={panelId} className={s.panel} aria-label={label}>
          {solutions.map(row)}
          <div className={s.sep} />
          {rest.map((item, i) => row(item, solutions.length + i))}
        </nav>
      )}
    </div>
  );
}
