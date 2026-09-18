/** Small hand-rolled stroke-icon set, keyed by nav href, so the CMS doesn't
 * need an icon-library dependency for six glyphs. */

type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

function IconGrid(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Icon>
  );
}

function IconZap(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="13 2 5 14 11 14 10 22 19 10 12 10 13 2" />
    </Icon>
  );
}

function IconClipboard(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="8.5" y="2.25" width="7" height="3.5" rx="1" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="14.5" x2="16" y2="14.5" />
      <line x1="8" y1="18" x2="13" y2="18" />
    </Icon>
  );
}

function IconInbox(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M4 12V6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V12" />
      <path d="M4 12v5.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12" />
    </Icon>
  );
}

function IconBarChart(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="2.5" y1="20.5" x2="21.5" y2="20.5" />
      <line x1="6" y1="20" x2="6" y2="11" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="18" y1="20" x2="18" y2="15" />
    </Icon>
  );
}

function IconUsers(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 20c0-3.4 2.8-6 6.25-6s6.25 2.6 6.25 6" />
      <path d="M15.5 5.75c1.5.4 2.5 1.7 2.5 3.25s-1 2.85-2.5 3.25" />
      <path d="M17.5 14.25c2.1.5 3.75 2.4 3.75 4.75" />
    </Icon>
  );
}

function IconBuildings(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 21V5.5h8V21" />
      <path d="M12 10h8v11" />
      <path d="M2.5 21h19" />
      <path d="M7 9h2M7 13h2M15 14h2M15 17.5h2" />
    </Icon>
  );
}

function IconTag(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .59 1.41l8.5 8.5a2 2 0 0 0 2.82 0l6.5-6.5a2 2 0 0 0 0-2.82l-8.5-8.5A2 2 0 0 0 11.5 3Z" />
      <circle cx="7.5" cy="7.5" r="1.25" />
    </Icon>
  );
}

function IconTrophy(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10" />
      <path d="M17 5h3v1.5A3.5 3.5 0 0 1 16.5 10" />
      <path d="M12 14v3M9 21h6M9.5 21c0-2 .8-3 2.5-4 1.7 1 2.5 2 2.5 4" />
    </Icon>
  );
}

function IconQuestion(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.25 9.5a2.75 2.75 0 1 1 4.15 2.37c-.9.55-1.4 1-1.4 2.13" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
    </Icon>
  );
}

export const NAV_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  "/admin": IconGrid,
  "/admin/product-brands": IconTag,
  "/admin/achievements": IconTrophy,
  "/admin/faq": IconQuestion,
  "/admin/calculator-ev": IconZap,
  "/admin/commercial-industrial": IconBuildings,
  "/admin/leads-form": IconClipboard,
  "/admin/enquiries": IconInbox,
  "/admin/analytics": IconBarChart,
  "/admin/users": IconUsers,
};

export function IconLogOut(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <polyline points="15 16 20 12 15 8" />
      <line x1="20" y1="12" x2="9" y2="12" />
    </Icon>
  );
}
