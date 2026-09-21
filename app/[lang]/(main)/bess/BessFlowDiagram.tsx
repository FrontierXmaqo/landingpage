"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

/**
 * Ported from a client-supplied artifact: a fixed 1400x880 artboard with
 * the same four nodes / six arrows as the client's original technical
 * diagram (do not re-route without being asked). JS scales the artboard
 * to the container width so it stays crisp at any size, and every
 * animation shares one `--T` duration so the loop is seamless. Text is
 * fully driven by `t` so the diagram works in any locale.
 *
 * Rendered small next to the hero copy, plus a zoom button that opens the
 * same artboard full-size in a modal — the labels are too dense to read
 * at hero-card width on a phone, so this is the way to actually read them
 * on mobile rather than trying to cram everything into a tiny card.
 */

function SolarIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="h-full w-full">
      <defs>
        <clipPath id="pvClip">
          <polygon points="30,78 48,42 95,42 77,78" />
        </clipPath>
      </defs>
      <g className="bess-rays" stroke="var(--sun)" strokeWidth="4.5" strokeLinecap="round">
        <path d="M25 4v5M25 37v5M5 23h5M40 23h5M11.5 9.5l3.2 3.2M35.3 33.3l3.2 3.2M38.5 9.5l-3.2 3.2M14.7 33.3l-3.2 3.2" />
      </g>
      <circle className="bess-disc" cx="25" cy="23" r="11" fill="var(--sun)" />
      <rect x="6" y="84" width="88" height="10" rx="5" fill="var(--ground)" />
      <path d="M52 76v10M72 76v10" stroke="var(--case)" strokeWidth="6" strokeLinecap="round" />
      <polygon points="30,78 48,42 95,42 77,78" fill="var(--pv)" />
      <g stroke="var(--pv2)" strokeWidth="2.6" strokeLinecap="round" opacity=".9">
        <path d="M42,78 60,42M54,78 72,42M66,78 84,42M38.5,60 85.5,60" />
      </g>
      <g clipPath="url(#pvClip)">
        <polygon className="bess-glint" points="22,80 40,40 52,40 34,80" fill="#fff" opacity="0" />
      </g>
    </svg>
  );
}

function FacilityIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="h-full w-full">
      <rect x="6" y="84" width="88" height="10" rx="5" fill="var(--ground)" />
      <rect x="26" y="26" width="9" height="16" rx="3" fill="var(--bldg)" />
      <rect x="10" y="48" width="44" height="38" rx="6" fill="var(--bldg)" />
      <rect x="54" y="32" width="36" height="54" rx="6" fill="var(--bldg2)" />
      <g fill="var(--tile)">
        <rect className="bess-w" style={{ "--d": "0s" } as React.CSSProperties} x="18" y="57" width="10" height="9" rx="2.5" />
        <rect className="bess-w" style={{ "--d": "-.35s" } as React.CSSProperties} x="34" y="57" width="10" height="9" rx="2.5" />
        <rect className="bess-w" style={{ "--d": "-.7s" } as React.CSSProperties} x="18" y="72" width="10" height="9" rx="2.5" />
        <rect className="bess-w" style={{ "--d": "-1.05s" } as React.CSSProperties} x="62" y="43" width="9" height="8" rx="2.5" />
        <rect className="bess-w" style={{ "--d": "-1.4s" } as React.CSSProperties} x="75" y="43" width="9" height="8" rx="2.5" />
        <rect className="bess-w" style={{ "--d": "-.5s" } as React.CSSProperties} x="62" y="57" width="9" height="8" rx="2.5" />
        <rect className="bess-w" style={{ "--d": "-1.7s" } as React.CSSProperties} x="75" y="57" width="9" height="8" rx="2.5" />
      </g>
      <rect x="34" y="72" width="12" height="14" rx="3" fill="var(--pv)" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="h-full w-full">
      <rect x="6" y="84" width="88" height="10" rx="5" fill="var(--ground)" />
      <rect x="40" y="20" width="20" height="8" rx="3.5" fill="var(--case)" />
      <rect x="16" y="26" width="68" height="58" rx="12" fill="var(--case)" />
      <rect x="24" y="34" width="52" height="42" rx="7" fill="var(--store)" opacity=".2" />
      <rect className="bess-bf" x="24" y="58" width="52" height="18" rx="7" fill="var(--store)" />
      <path className="bess-bolt" d="M54 38 L38 60 h10 l-4 16 l17-23 H55 z" fill="#fff" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="h-full w-full">
      <rect x="6" y="84" width="88" height="10" rx="5" fill="var(--ground)" />
      <g stroke="var(--grid)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M50 10 L72 84 M50 10 L28 84" />
        <path d="M33 66 H67 M37 48 H63" />
        <path d="M24 34 H76" />
      </g>
      <circle className="bess-spark" cx="50" cy="12" r="5" fill="#FFD84D" stroke="#fff" strokeWidth="2.5" />
      <g fill="var(--grid)">
        <circle className="bess-ins" style={{ "--d": "0s" } as React.CSSProperties} cx="24" cy="34" r="5" />
        <circle className="bess-ins" style={{ "--d": "-1s" } as React.CSSProperties} cx="76" cy="34" r="5" />
      </g>
    </svg>
  );
}

const DIAGRAM_STYLES = `
  .bess-flow-canvas {
    --sun:#EE8F0B; --store:#12A56E; --grid:#3765C9; --bldgc:#1B5E3A;
    --ink:#122129; --ink2:#4E5F69; --muted:#7C8B93;
    --paper:#FBF8F3; --line:#E6DFD4;
    --pv:#20406E; --pv2:#6E97D0; --bldg:#31505F; --bldg2:#4A6E80;
    --case:#DCE4E9; --ground:#CFE3D2; --tile:#F5F1EA;
    --T: 2s;
  }
  .bess-flow-tile { background: var(--tile); border-radius: 22px; display: grid; place-items: center; padding: 12px; animation: bessBob var(--T) ease-in-out infinite; }
  .bess-flow-pill { background: #fff; border: 2px solid var(--c); border-radius: 13px; text-align: center; padding: 8px 10px 9px; }
  .bess-flow-pill .t { font-size: 16.5px; font-weight: 600; color: var(--c); letter-spacing: .2px; line-height: 1.15; }
  .bess-flow-pill .n { font-size: 12.5px; color: var(--muted); margin-top: 2px; line-height: 1.2; font-weight: 400; }
  .bess-flow-alab { font-size: 14.5px; font-weight: 500; line-height: 1.28; color: var(--c); text-align: center; }
  .bess-flow-strip { background: #F1F8F4; border: 1.5px solid #BFE4D2; border-radius: 16px; display: flex; align-items: center; justify-content: center; padding: 0 34px; text-align: center; }
  .bess-flow-strip p { font-size: 17px; line-height: 1.4; color: var(--ink2); font-weight: 400; margin: 0; }
  .bess-flow-strip b { font-weight: 600; color: var(--ink); }
  .bess-flow-legend { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
  .bess-flow-lg { display: flex; gap: 8px; align-items: center; font-size: 12.5px; color: var(--ink2); font-weight: 500; }
  .bess-flow-lg i { width: 20px; height: 5px; border-radius: 3px; display: block; }

  .bess-flow { animation: bessDash var(--T) linear infinite; }
  @keyframes bessDash { to { stroke-dashoffset: -64; } }
  .bess-flow-dot { animation-name: bessDashDot; }
  @keyframes bessDashDot { to { stroke-dashoffset: -88; } }
  @keyframes bessBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  .bess-rays { transform-box: view-box; transform-origin: 25px 23px; animation: bessRays var(--T) ease-in-out infinite; }
  @keyframes bessRays { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .bess-disc { transform-box: view-box; transform-origin: 25px 23px; animation: bessDisc var(--T) ease-in-out infinite; }
  @keyframes bessDisc { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
  .bess-glint { animation: bessGlint var(--T) linear infinite; }
  @keyframes bessGlint { 0% { transform: translateX(-6px); opacity: 0; } 12% { opacity: .34; } 46% { opacity: 0; } 100% { transform: translateX(66px); opacity: 0; } }
  .bess-w { animation: bessBlink var(--T) ease-in-out infinite; animation-delay: var(--d, 0s); }
  @keyframes bessBlink { 0%, 100% { opacity: .95; } 45% { opacity: .34; } }
  .bess-bf { animation: bessCharge var(--T) ease-in-out infinite; }
  @keyframes bessCharge { 0%, 100% { y: 58px; height: 18px; } 50% { y: 34px; height: 42px; } }
  .bess-bolt { transform-box: view-box; transform-origin: 48px 57px; animation: bessBoltPulse var(--T) ease-in-out infinite; }
  @keyframes bessBoltPulse { 0%, 100% { opacity: .82; transform: scale(.96); } 50% { opacity: 1; transform: scale(1.06); } }
  .bess-ins { transform-box: view-box; transform-origin: center; animation: bessIns var(--T) ease-in-out infinite; animation-delay: var(--d, 0s); }
  @keyframes bessIns { 0%, 100% { opacity: .55; transform: scale(.88); } 50% { opacity: 1; transform: scale(1.18); } }
  .bess-spark { animation: bessSpark var(--T) linear infinite; }
  @keyframes bessSpark { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { transform: translate(-21px,72px); opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .bess-flow-tile, .bess-flow, .bess-rays, .bess-disc, .bess-glint, .bess-w, .bess-bf, .bess-bolt, .bess-ins, .bess-spark {
      animation: none !important;
    }
  }
`;

type HeroVisualDict = Dictionary["bess"]["heroVisual"];

function useFitCanvas() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const fit = () => {
      canvas.style.transform = `scale(${frame.clientWidth / 1400})`;
    };
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    fit();
    return () => ro.disconnect();
  }, []);

  return { frameRef, canvasRef };
}

function FlowArtboard({ t }: { t: HeroVisualDict }) {
  const { frameRef, canvasRef } = useFitCanvas();

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden rounded-[20px]" style={{ aspectRatio: "1400 / 880" }}>
      <div
        ref={canvasRef}
        className="bess-flow-canvas absolute left-0 top-0 h-[880px] w-[1400px] origin-top-left rounded-[20px] bg-[var(--paper)]"
      >
        <div className="absolute left-[48px] top-[26px] w-[820px]">
          <h3 className="m-0 text-[37px] font-semibold leading-[1.1] tracking-[-0.6px] text-[var(--ink)]">{t.title}</h3>
          <p className="mt-[7px] text-[16.5px] font-normal text-[var(--ink2)]">{t.subtitle}</p>
        </div>

        <div className="bess-flow-legend absolute right-[48px] top-[44px]">
          <span className="bess-flow-lg">
            <i style={{ background: "var(--sun)" }} />
            {t.legend[0]}
          </span>
          <span className="bess-flow-lg">
            <i style={{ background: "var(--store)" }} />
            {t.legend[1]}
          </span>
          <span className="bess-flow-lg">
            <i style={{ background: "var(--grid)" }} />
            {t.legend[2]}
          </span>
        </div>

        <div
          className="absolute rounded-[26px] border border-[var(--line)] bg-white shadow-[0_18px_44px_-28px_rgba(18,33,41,.35)]"
          style={{ left: 36, top: 112, width: 1328, height: 718 }}
        />

        <svg className="absolute left-0 top-0" width="1400" height="880" fill="none" aria-hidden="true">
          <defs>
            <marker id="bess-aS" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#EE8F0B" />
            </marker>
            <marker id="bess-aG" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#12A56E" />
            </marker>
            <marker id="bess-aB" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#3765C9" />
            </marker>
          </defs>
          <g strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity=".32">
            <path d="M305 312 H 610" stroke="#EE8F0B" />
            <path d="M222 398 V 576 H 607" stroke="#EE8F0B" />
            <path d="M662 498 V 381" stroke="#12A56E" />
            <path d="M1080 272 H 787" stroke="#3765C9" />
            <path d="M782 352 H 1075" stroke="#12A56E" />
            <path d="M1162 398 V 576 H 793" stroke="#12A56E" />
          </g>
          <g strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="bess-flow" d="M305 312 H 610" stroke="#EE8F0B" strokeDasharray="18 14" markerEnd="url(#bess-aS)" />
            <path className="bess-flow bess-flow-dot" d="M222 398 V 576 H 607" stroke="#EE8F0B" strokeDasharray="6 16" markerEnd="url(#bess-aS)" />
            <path className="bess-flow" d="M662 498 V 381" stroke="#12A56E" strokeDasharray="18 14" markerEnd="url(#bess-aG)" />
            <path className="bess-flow" d="M1080 272 H 787" stroke="#3765C9" strokeDasharray="18 14" markerEnd="url(#bess-aB)" />
            <path className="bess-flow" d="M782 352 H 1075" stroke="#12A56E" strokeDasharray="18 14" markerEnd="url(#bess-aG)" />
            <path className="bess-flow" d="M1162 398 V 576 H 793" stroke="#12A56E" strokeDasharray="18 14" markerEnd="url(#bess-aG)" />
          </g>
        </svg>

        <div className="bess-flow-alab absolute" style={{ "--c": "var(--sun)", left: 330, top: 262, width: 260 } as React.CSSProperties}>
          {t.arrowLabels[0]}
        </div>
        <div className="bess-flow-alab absolute" style={{ "--c": "var(--sun)", left: 280, top: 522, width: 290 } as React.CSSProperties}>
          {t.arrowLabels[1]}
        </div>
        <div
          className="bess-flow-alab absolute text-left"
          style={{ "--c": "var(--store)", left: 684, top: 398, width: 190 } as React.CSSProperties}
        >
          {t.arrowLabels[2]}
        </div>
        <div className="bess-flow-alab absolute" style={{ "--c": "var(--grid)", left: 790, top: 226, width: 242 } as React.CSSProperties}>
          {t.arrowLabels[3]}
        </div>
        <div className="bess-flow-alab absolute" style={{ "--c": "var(--store)", left: 800, top: 302, width: 262 } as React.CSSProperties}>
          {t.arrowLabels[4]}
        </div>
        <div className="bess-flow-alab absolute" style={{ "--c": "var(--store)", left: 830, top: 522, width: 300 } as React.CSSProperties}>
          {t.arrowLabels[5]}
        </div>

        <div className="bess-flow-pill absolute" style={{ "--c": "var(--sun)", left: 112, top: 186, width: 220 } as React.CSSProperties}>
          <div className="t">{t.nodes.solar.label}</div>
          <div className="n">{t.nodes.solar.caption}</div>
        </div>
        <div className="bess-flow-tile absolute" style={{ left: 152, top: 248, width: 140, height: 140 }}>
          <SolarIcon />
        </div>

        <div className="bess-flow-pill absolute" style={{ "--c": "var(--bldgc)", left: 578, top: 164, width: 244 } as React.CSSProperties}>
          <div className="t">{t.nodes.facility.label}</div>
          <div className="n">{t.nodes.facility.caption}</div>
        </div>
        <div className="bess-flow-tile absolute" style={{ left: 630, top: 226, width: 140, height: 140, animationDelay: "-.5s" }}>
          <FacilityIcon />
        </div>

        <div className="bess-flow-pill absolute" style={{ "--c": "var(--grid)", left: 1042, top: 150, width: 246 } as React.CSSProperties}>
          <div className="t">{t.nodes.grid.label}</div>
          <div className="n">{t.nodes.grid.caption}</div>
        </div>
        <div className="bess-flow-tile absolute" style={{ left: 1092, top: 248, width: 140, height: 140, animationDelay: "-1.5s" }}>
          <GridIcon />
        </div>

        <div className="bess-flow-tile absolute" style={{ left: 630, top: 506, width: 140, height: 140, animationDelay: "-1s" }}>
          <BatteryIcon />
        </div>
        <div className="bess-flow-pill absolute" style={{ "--c": "var(--store)", left: 568, top: 656, width: 264 } as React.CSSProperties}>
          <div className="t">{t.nodes.battery.label}</div>
          <div className="n">{t.nodes.battery.caption}</div>
        </div>

        <div className="bess-flow-strip absolute" style={{ left: 80, top: 738, width: 1240, height: 70 }}>
          <p>
            {t.footerPrefix}
            <b>{t.footerBold}</b>
            {t.footerSuffix}
          </p>
        </div>
      </div>
    </div>
  );
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
      <line x1="11" y1="8" x2="11" y2="14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export default function BessFlowDiagram({ t }: { t: HeroVisualDict }) {
  const [zoomed, setZoomed] = useState(false);

  const close = useCallback(() => setZoomed(false), []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed, close]);

  return (
    <>
      <style>{DIAGRAM_STYLES}</style>

      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={t.zoomLabel}
        className="group relative block w-full rounded-[20px] border border-base-line bg-[var(--paper,#FBF8F3)] p-0 text-left shadow-xl"
      >
        <FlowArtboard t={t} />
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-base-ink/85 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition group-hover:bg-base-ink sm:bottom-4 sm:right-4">
          <ZoomIcon />
          {t.zoomLabel}
        </span>
      </button>

      {zoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base-ink/80 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t.title}
          onClick={close}
        >
          <div className="relative w-full max-w-[1200px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={close}
              aria-label={t.zoomCloseLabel}
              className="absolute -top-12 right-0 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:-top-11"
            >
              <CloseIcon />
              {t.zoomCloseLabel}
            </button>
            <div className="rounded-[20px] shadow-2xl">
              <FlowArtboard t={t} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
