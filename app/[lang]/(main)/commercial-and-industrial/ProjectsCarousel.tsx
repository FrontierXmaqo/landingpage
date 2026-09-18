"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Project } from "./content";
import type { CiCopy } from "./copy";
import { IconChevron, IconClose, IconPause, IconPlay, ProjectIcon } from "./icons";

/**
 * Coverflow carousel for the project showcase.
 *
 * Hand-rolled rather than pulled from a slider package: the whole effect is a
 * transform per slide driven by its distance from the active one, and this page
 * exists to capture leads, so it is not worth ~140KB of library to do it.
 *
 * Every offset below is measured in percentages of the card's own width, so the
 * layout scales from a phone (one card with the neighbours peeking at the
 * edges) to a desktop without measuring anything in JS.
 */

const AUTOPLAY_MS = 3000;
/** Slides further out than this are not painted at all. One either side of
 *  the centre keeps the stage inside the container at every width. */
const VISIBLE_RANGE = 1;

export type Surface = "light" | "navy" | "green";

const SURFACE: Record<Surface, {
  section: string;
  heading: string;
  body: string;
  control: string;
  dot: string;
  dotOn: string;
  link: string;
}> = {
  light: {
    section: "bg-base-bg",
    heading: "text-base-ink",
    body: "text-base-slate",
    control:
      "border-base-line bg-base-panel text-base-ink hover:border-base-slate focus-visible:outline-brand-green-ink",
    dot: "bg-base-line",
    dotOn: "bg-brand-orange-deep",
    link: "text-brand-green-ink hover:text-brand-green-deep",
  },
  navy: {
    section: "bg-brand-navy",
    heading: "text-white",
    body: "text-white/80",
    control: "border-white/25 bg-white/10 text-white hover:border-white/60 focus-visible:outline-white",
    dot: "bg-white/25",
    dotOn: "bg-brand-orange-deep",
    link: "text-white hover:text-white/80",
  },
  green: {
    section: "bg-brand-green-deep",
    heading: "text-white",
    body: "text-white/80",
    control: "border-white/25 bg-white/10 text-white hover:border-white/60 focus-visible:outline-white",
    dot: "bg-white/25",
    dotOn: "bg-brand-orange-deep",
    link: "text-white hover:text-white/80",
  },
};

/** Shortest signed distance from `i` to `active` around a loop of `total`. */
function wrappedOffset(i: number, active: number, total: number) {
  let d = (i - active + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

function ProjectCard({
  project,
  actionLabel,
  large = false,
  showAction = false,
}: {
  project: Project;
  actionLabel: string;
  large?: boolean;
  showAction?: boolean;
}) {
  return (
    <>
      <div className={`relative w-full shrink-0 ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover"
            sizes={large ? "(min-width: 768px) 700px, 92vw" : "(min-width: 768px) 380px, 80vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-green-tint text-brand-green-deep/60">
            <ProjectIcon tag={project.tag} className="h-10 w-10" />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-brand-orange-deep px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
          {project.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 text-left">
        <p className="text-2xl font-bold tracking-tight text-base-ink">{project.capacity}</p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-base-ink">{project.client}</h3>
        {project.panels && (
          <p className="mt-4 flex items-center gap-2.5 border-t border-base-line pt-4 text-sm text-base-slate">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange-deep" />
            {project.panels}
          </p>
        )}
        {/* Only the card in front carries this: it both says the card opens
            and takes up the slack under a short panel count. */}
        {showAction && (
          <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-orange-ink">
            {actionLabel}
            <IconChevron className="h-4 w-4" />
          </span>
        )}
      </div>
    </>
  );
}

export default function ProjectsCarousel({
  projects,
  surface = "light",
  videoUrl,
  t,
}: {
  projects: Project[];
  surface?: Surface;
  videoUrl?: string;
  t: CiCopy["projects"];
}) {
  const total = projects.length;
  const s = SURFACE[surface];
  const labelId = useId();

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** The card that opened the dialog, so focus can go back where it came from. */
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const go = useCallback((delta: number) => setActive((i) => (i + delta + total) % total), [total]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Autoplay only runs while the section is on screen, and turns one card as
  // soon as it scrolls into view so the motion is seen instead of missed.
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !playing || reducedMotion) return;
    const id = window.setTimeout(() => go(1), 400);
    return () => window.clearTimeout(id);
    // Only on entering the viewport, not on every play/pause toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Autoplay stops while the visitor is tabbing through the
  // carousel, while the dialog is open, while the tab is in the background, and
  // whenever the visitor has asked for reduced motion.
  useEffect(() => {
    if (!inView || !playing || paused || reducedMotion || openIndex !== null) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") go(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [inView, playing, paused, reducedMotion, openIndex, go]);

  // Dialog: escape to close, focus moved in and restored on the way out, and
  // the page behind held still.
  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIndex(null);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [openIndex]);

  const openProject = projects[openIndex ?? 0];

  return (
    <section ref={sectionRef} id="projects" className={`scroll-mt-20 py-16 sm:py-20 ${s.section}`} aria-labelledby={labelId}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] ${s.body}`}>
          <span aria-hidden className="h-2 w-2 shrink-0 bg-brand-orange-deep" />
          {t.eyebrow}
        </p>
        <h2 id={labelId} className={`mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl ${s.heading}`}>
          {t.title}
        </h2>
        <p className={`mt-4 max-w-2xl text-base leading-relaxed ${s.body}`}>
          {t.body}
        </p>

        <div
          className="relative mt-12"
          aria-roledescription="carousel"
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* The stage. Cards are absolutely positioned and placed by transform,
              so the row's height never depends on which card is in front. */}
          <div
            className="relative h-[400px] sm:h-[420px]"
            style={{ perspective: "1600px" }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                go(1);
              }
            }}
          >
            {projects.map((project, i) => {
              const offset = wrappedOffset(i, active, total);
              const distance = Math.abs(offset);
              const isActive = offset === 0;
              const hidden = distance > VISIBLE_RANGE;

              return (
                <div
                  key={project.client}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}: ${project.client}`}
                  aria-hidden={hidden || undefined}
                  className="absolute left-1/2 top-0 w-[74vw] max-w-[330px] sm:w-[330px]"
                  style={{
                    transform: `translateX(-50%) translateX(${offset * 76}%) rotateY(${offset * 26}deg) scale(${
                      1 - distance * 0.12
                    })`,
                    zIndex: total - distance,
                    opacity: hidden ? 0 : 1,
                    pointerEvents: hidden ? "none" : undefined,
                    transition: reducedMotion ? "none" : "transform 600ms cubic-bezier(.22,.7,.3,1), opacity 400ms ease",
                  }}
                >
                  <button
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      if (isActive) {
                        openerRef.current = e.currentTarget;
                        setOpenIndex(i);
                      } else {
                        setActive(i);
                      }
                    }}
                    aria-label={
                      isActive
                        ? t.viewDetailsFor
                            .replace("{client}", project.client)
                            .replace("{capacity}", project.capacity)
                        : `Show ${project.client}`
                    }
                    className="relative flex h-[370px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel text-left shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange-deep sm:h-[390px]"
                  >
                    <ProjectCard project={project} actionLabel={t.viewDetails} showAction={isActive} />

                    {/* Side cards are pushed back visually as well as spatially -
                        this is the darkening, and it lifts on the centre card. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-base-ink"
                      style={{
                        opacity: distance === 0 ? 0 : 0.3,
                        transition: reducedMotion ? "none" : "opacity 600ms ease",
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Controls. Placed after the stage in the DOM so a keyboard reaches
              the active card first. */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.prev}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${s.control}`}
            >
              <IconChevron direction="left" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Choose a project">
              {projects.map((project, i) => (
                <button
                  key={project.client}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={project.client}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    i === active ? `w-7 ${s.dotOn}` : `w-2 ${s.dot}`
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.next}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${s.control}`}
            >
              <IconChevron />
            </button>

            {/* Anything that moves on its own needs a way to stop it. */}
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? t.pause : t.resume}
              className={`ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${s.control}`}
            >
              {playing ? <IconPause /> : <IconPlay />}
            </button>
          </div>
        </div>

        {videoUrl && (
          <p className="mt-10 text-center">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold underline underline-offset-4 ${s.link}`}
            >
              {t.videoLink}
            </a>
          </p>
        )}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
        >
          <button
            type="button"
            aria-label={t.close}
            tabIndex={-1}
            onClick={() => setOpenIndex(null)}
            className="absolute inset-0 cursor-default bg-base-ink/70 backdrop-blur-sm"
          />

          <div
            ref={dialogRef}
            className="animate-fade-in-up relative max-h-full w-full max-w-3xl overflow-y-auto rounded-2xl bg-base-panel shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label={t.closeDialog}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-base-panel/90 text-base-ink shadow-md transition hover:bg-base-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-deep"
            >
              <IconClose />
            </button>

            <ProjectCard project={openProject} actionLabel={t.viewDetails} large />

            <div className="border-t border-base-line px-6 pb-7 pt-6 sm:px-8">
              <h2 id="project-dialog-title" className="sr-only">
                {openProject.client}, {openProject.capacity}
              </h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-base-slate">{t.client}</dt>
                  <dd className="mt-1 text-sm font-semibold text-base-ink">{openProject.client}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-base-slate">{t.category}</dt>
                  <dd className="mt-1 text-sm font-semibold text-base-ink">{openProject.tag}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-base-slate">{t.capacity}</dt>
                  <dd className="mt-1 text-sm font-semibold text-base-ink">{openProject.capacity}</dd>
                </div>
                {openProject.panels && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-base-slate">{t.modules}</dt>
                    <dd className="mt-1 text-sm font-semibold text-base-ink">{openProject.panels}</dd>
                  </div>
                )}
              </dl>

              {openProject.summary && (
                <p className="mt-6 text-sm leading-relaxed text-base-slate">{openProject.summary}</p>
              )}

              <a
                href="#assessment"
                onClick={() => setOpenIndex(null)}
                className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-deep"
              >
                {t.quoteCta}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
