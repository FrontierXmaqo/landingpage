"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Opens a lightbox with the TNB bill breakdown diagram — the button exists
 * because the diagram's labels are unreadable at the width the problem
 * section otherwise leaves for it; the modal is the only place it needs to
 * be large enough to actually read.
 */
export default function HiddenChargesButton() {
  const [open, setOpen] = useState(false);

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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Detailed calculation of your TNB bill"
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-ink/80 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-full w-full max-w-4xl overflow-auto rounded-2xl bg-base-panel p-3 shadow-2xl sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-base-panel text-base-ink shadow-md transition hover:bg-base-bg"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <div className="relative aspect-[1200/675] w-full">
              <Image
                src="/bess/hidden-charges-bill-breakdown.webp"
                alt="Detailed calculation of a TNB bill, showing how Maximum Demand charges (Capacity Charge plus Network Charge, multiplied by Maximum Demand) and Energy Charges (total energy used multiplied by the energy rate) map onto the itemised bill"
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 900px, 100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
