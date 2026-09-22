import Link from "next/link";
import { SEGMENTS } from "@/lib/segments";
import { ALL_PAGE_NAMES, pathsForPageName } from "@/lib/pageNames";
import { DEVICES, RANGES, withFilter, type Filters } from "./filters";

/**
 * Plain links, not buttons: the aggregation happens in Postgres, so changing a
 * filter is a navigation. That also means the whole control works before any
 * JavaScript loads, and a filtered view can be pasted to a colleague.
 *
 * The segment row reuses the pill-and-dot nav the FAQ, Lead Form and Enquiries
 * editors already use, with each line's own colour from the live site, so this
 * page reads as part of the same CMS rather than a separate tool.
 */

const PILL = "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition";
const PILL_OFF = "text-base-slate hover:bg-base-bg hover:text-base-ink";
const PILL_ON = "bg-base-bg text-base-ink shadow-sm";

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">{label}</span>
      <div className="flex w-fit flex-wrap gap-1 rounded-full border border-base-line bg-base-panel p-1 shadow-sm">
        {children}
      </div>
    </div>
  );
}

export default function FilterBar({
  filters,
  segments,
}: {
  filters: Filters;
  /** Only the segments this role may see. One segment means no choice to offer. */
  segments: typeof SEGMENTS;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {segments.length > 1 && (
      <Group label="Segment">
        <Link
          href={withFilter(filters, { segment: "all", page: null, path: null })}
          aria-current={filters.segment === "all" ? "true" : undefined}
          className={`${PILL} ${filters.segment === "all" ? PILL_ON : PILL_OFF}`}
        >
          All
        </Link>
        {segments.map((s) => (
          <Link
            key={s.id}
            // Clearing the page matters: a page from the old segment would
            // otherwise filter the new one down to nothing.
            href={withFilter(filters, { segment: s.id, page: null, path: null })}
            aria-current={filters.segment === s.id ? "true" : undefined}
            className={`${PILL} ${filters.segment === s.id ? PILL_ON : PILL_OFF}`}
          >
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: s.dot }} />
            {s.label}
          </Link>
        ))}
      </Group>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Group label="Period">
          {RANGES.map((r) => (
            <Link
              key={r.id}
              href={withFilter(filters, { range: r.id })}
              aria-current={filters.range === r.id ? "true" : undefined}
              className={`${PILL} ${filters.range === r.id ? PILL_ON : PILL_OFF}`}
            >
              {r.label}
            </Link>
          ))}
        </Group>

        <Group label="Device">
          {DEVICES.map((d) => (
            <Link
              key={d.id}
              href={withFilter(filters, { device: d.id })}
              aria-current={filters.device === d.id ? "true" : undefined}
              className={`${PILL} ${filters.device === d.id ? PILL_ON : PILL_OFF}`}
            >
              {d.label}
            </Link>
          ))}
        </Group>

        <Group label="Page">
          <Link
            href={withFilter(filters, { page: null, path: null })}
            aria-current={!filters.page ? "true" : undefined}
            className={`${PILL} ${!filters.page ? PILL_ON : PILL_OFF}`}
          >
            All pages
          </Link>
          {ALL_PAGE_NAMES.map((name) => (
            <Link
              key={name}
              // Clearing the path matters: a URL from the old page would
              // otherwise filter the new one down to nothing.
              href={withFilter(filters, { page: name, path: null })}
              aria-current={filters.page === name ? "true" : undefined}
              className={`${PILL} ${filters.page === name ? PILL_ON : PILL_OFF}`}
            >
              {name}
            </Link>
          ))}
        </Group>
      </div>

      {filters.page && (
        <Group label="URL">
          <Link
            href={withFilter(filters, { path: null })}
            aria-current={!filters.path ? "true" : undefined}
            className={`${PILL} ${!filters.path ? PILL_ON : PILL_OFF}`}
          >
            All languages
          </Link>
          {pathsForPageName(filters.page).map((p) => (
            <Link
              key={p}
              href={withFilter(filters, { path: p })}
              aria-current={filters.path === p ? "true" : undefined}
              className={`${PILL} ${filters.path === p ? PILL_ON : PILL_OFF}`}
            >
              <code>{p}</code>
            </Link>
          ))}
        </Group>
      )}
    </div>
  );
}
