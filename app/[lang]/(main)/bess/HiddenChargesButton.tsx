"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Opens a lightbox with the TNB bill breakdown diagram — the button exists
 * because the diagram's labels are unreadable at the width the problem
 * section otherwise leaves for it; the modal is the only place it needs to
 * be large enough to actually read.
 *
 * The modal is portaled straight to document.body: this button lives
 * inside a ScrollReveal wrapper, whose scroll-driven CSS animation keeps a
 * non-none `transform` on that ancestor. A transformed ancestor becomes the
 * containing block for `position: fixed` descendants, so without the
 * portal the "fullscreen" overlay would actually be pinned to that
 * section's box instead of the viewport.
 */
export default function HiddenChargesButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-base-line bg-base-panel px-5 py-2.5 text-sm font-semibold text-base-ink transition hover:border-base-slate"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
        </svg>
        Hidden Charges
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Detailed calculation of your TNB bill"
            className="fixed inset-0 z-50 flex items-center justify-center bg-base-ink/85 p-2 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute -top-2 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-base-panel text-base-ink shadow-md transition hover:bg-base-bg sm:-top-4 sm:-right-4"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <div className="relative h-[92vh] w-[98vw] overflow-hidden rounded-2xl bg-base-panel shadow-2xl sm:h-[94vh] sm:w-[96vw]">
                <Image
                  src="/bess/hidden-charges-bill-breakdown.webp"
                  alt="Detailed calculation of a TNB bill, showing how Maximum Demand charges (Capacity Charge plus Network Charge, multiplied by Maximum Demand) and Energy Charges (total energy used multiplied by the energy rate) map onto the itemised bill"
                  fill
                  priority
                  className="object-contain"
                  sizes="98vw"
                  quality={100}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
