"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { StoryMilestone } from "./content";
import { FactoryScene, HouseScene } from "./StoryScenes";
import styles from "./StoryRoad.module.css";

// Bezier handle length as a fraction of the drop between two stops. 0.37 traces
// close to a sine wave, so the bends read as a road rather than a zig-zag, and
// it keeps y rising monotonically along the path, which lengthAtY relies on.
const BEND = 0.37;
// Path length between samples in the y → length lookup table.
const SAMPLE = 4;
// Smoothing time constant for the truck, in ms.
const EASE_MS = 110;

/** Offset of `el` inside `root`, summed up the offsetParent chain (transforms ignored). */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

export default function StoryRoad({ milestones }: { milestones: StoryMilestone[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const svg = svgRef.current!;
    const truck = truckRef.current!;
    const body = truck.firstElementChild as HTMLElement;
    const [road, done, lane] = Array.from(svg.querySelectorAll("path"));
    const dots = Array.from(svg.querySelectorAll("circle"));
    const items = Array.from(root.querySelectorAll<HTMLLIElement>("[data-stop]"));
    const wide = matchMedia("(min-width: 700px)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");

    let total = 0;
    let step = 1;
    let ys = new Float32Array(0);
    let stops: number[] = [];
    let reached = -1;
    let s = -1; // truck's current distance along the path; -1 = snap on next frame
    let last = -1;
    let raf = 0;
    let alive = true;

    function lengthAtY(y: number) {
      const n = ys.length;
      if (y <= ys[0]) return 0;
      if (y >= ys[n - 1]) return total;
      let lo = 0;
      let hi = n - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] <= y) lo = mid;
        else hi = mid;
      }
      return (lo + (y - ys[lo]) / (ys[hi] - ys[lo] || 1)) * step;
    }

    function layout() {
      if (!alive) return; // fonts.ready can resolve after unmount
      const w = root.clientWidth;
      const h = root.clientHeight;
      const css = getComputedStyle(root);
      const gap = parseFloat(css.getPropertyValue("--gap"));
      const swing = parseFloat(css.getPropertyValue("--swing"));
      const dotR = css.getPropertyValue("--dot-r").trim();

      // One apex per stop, level with its year and on the outer side of the
      // text column, so the copy always sits outside the bend.
      const apex = items.map((li, i) => {
        const text = li.querySelector<HTMLElement>("[data-text]")!;
        const year = li.querySelector<HTMLElement>("[data-year]")!;
        const t = offsetIn(text, root);
        const y = offsetIn(year, root).y + year.offsetHeight / 2;
        if (!wide.matches) return { x: t.x - gap - (i % 2 === 0 ? swing : 0), y };
        return { x: i % 2 === 0 ? t.x + text.offsetWidth + gap : t.x - gap, y };
      });

      // Mirror one bend past each end so the road enters and leaves the
      // section mid-curve instead of starting on a dot.
      const n = apex.length;
      const pts = [
        { x: apex[1].x, y: 2 * apex[0].y - apex[1].y },
        ...apex,
        { x: apex[n - 2].x, y: 2 * apex[n - 1].y - apex[n - 2].y },
      ];
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const k = (b.y - a.y) * BEND;
        d += `C${a.x} ${a.y + k} ${b.x} ${b.y - k} ${b.x} ${b.y}`;
      }

      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      for (const p of [road, done, lane]) p.setAttribute("d", d);

      total = road.getTotalLength();
      const count = Math.ceil(total / SAMPLE) + 1;
      step = total / (count - 1);
      ys = new Float32Array(count);
      for (let i = 0; i < count; i++) ys[i] = road.getPointAtLength(i * step).y;

      // With the stops evenly spaced these lengths are evenly spaced too; if a
      // long entry pushes its neighbour down, the dot still follows its text.
      stops = apex.map((p) => lengthAtY(p.y));
      stops.forEach((len, i) => {
        const p = road.getPointAtLength(len);
        dots[i].setAttribute("cx", p.x.toFixed(2));
        dots[i].setAttribute("cy", p.y.toFixed(2));
        dots[i].setAttribute("r", dotR);
      });

      done.style.strokeDasharray = `${total} ${total}`;
      root.dataset.ready = "";
      s = -1;
      kick();
    }

    function draw() {
      const p = road.getPointAtLength(s);
      const q = road.getPointAtLength(s + 2);
      truck.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      body.style.transform = `rotate(${Math.atan2(q.y - p.y, q.x - p.x)}rad)`;
      done.style.strokeDashoffset = String(total - s);

      let hit = 0;
      while (hit < stops.length && s >= stops[hit] - 0.5) hit++;
      if (hit !== reached) {
        reached = hit;
        items.forEach((li, i) => li.classList.toggle(styles.on, i < hit));
      }
    }

    function frame(time: number) {
      raf = 0;
      const top = root.getBoundingClientRect().top;
      const target = Math.min(Math.max(lengthAtY(innerHeight / 2 - top), stops[0]), stops[stops.length - 1]);
      if (s < 0 || still.matches) {
        s = target;
      } else {
        const dt = last < 0 ? 16 : Math.min(time - last, 64);
        s += (target - s) * (1 - Math.exp(-dt / EASE_MS));
        if (Math.abs(target - s) < 0.1) s = target;
      }
      last = time;
      draw();
      if (s !== target) raf = requestAnimationFrame(frame);
    }

    function kick() {
      if (raf || !stops.length) return;
      last = -1;
      raf = requestAnimationFrame(frame);
    }

    const resize = new ResizeObserver(layout);
    resize.observe(root);
    document.fonts?.ready.then(layout);
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    return () => {
      alive = false;
      resize.disconnect();
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.road}>
      <svg ref={svgRef} className={styles.svg} aria-hidden>
        <path className={styles.base} />
        <path className={styles.done} />
        <path className={styles.lane} />
        {milestones.map((m) => (
          <circle key={m.year} className={styles.dot} />
        ))}
      </svg>

      <ol className={styles.list}>
        {milestones.map((m, i) => (
          <li key={m.year} data-stop className={`${styles.item} ${i % 2 === 0 ? styles.left : styles.right}`}>
            <div data-text className={styles.content}>
              <p data-year className={`${styles.year} text-[28px] font-bold leading-none sm:text-4xl`}>
                {m.year}
              </p>
              <h3 className="mt-3 text-lg font-bold leading-snug text-base-ink sm:text-xl">{m.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-base-slate">{m.body}</p>
              {m.badges && (
                <ul className={`${styles.badges} mt-4 flex flex-wrap gap-2`}>
                  {m.badges.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-base-line bg-base-panel px-3 py-1 text-xs font-semibold text-base-ink"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {m.scene === "house" && <HouseScene className={`${styles.scene} ${styles.house}`} />}
            {m.scene === "factory" && <FactoryScene className={`${styles.scene} ${styles.factory}`} />}
          </li>
        ))}
      </ol>

      <div ref={truckRef} className={styles.truck} aria-hidden>
        <span className={styles.body}>
          <Image src="/story-truck.webp" alt="" width={288} height={118} unoptimized />
        </span>
      </div>
    </div>
  );
}
