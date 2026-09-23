import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE, HTML_LANG, getDictionary, hasLocale, localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import PagePerfTracker from "@/lib/pagePerf";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.homeTitle,
    description: t.homeDescription,
    // Cascades to every route under this layout, so their relative canonical
    // and hreflang values resolve to absolute URLs.
    metadataBase: SITE_URL,
    alternates: {
      canonical: localePath(lang),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l)])),
        // Where Google sends a visitor whose language matches none of the three.
        "x-default": localePath(DEFAULT_LOCALE),
      },
    },
    verification: {
      google: "FdVlWEEvys2RdCCMKjiAkXv3HGVMWr9foIpy036CmiA",
    },
  };
}

const GTM_ID = "GTM-54979CGR";
const META_PIXEL_ID = "868631075171591";

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang={HTML_LANG[lang]} className={`h-full antialiased ${outfit.variable}`}>
      <head>
        {/* The tag shims only — a few microseconds of work that define
            dataLayer and the fbq queue, so any event fired before the
            libraries land (a fast form submit, the PageView below) is queued
            and replayed rather than lost. */}
        <Script id="tag-queue" strategy="afterInteractive" nonce={nonce}>
          {`window.dataLayer=window.dataLayer||[];
window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document);
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>

        {/* gtm.js and fbevents.js are ~200KB of third-party JS, and their
            parse and execute time is the whole of this page's Total Blocking
            Time. Deferring to the load event was not enough: Lighthouse
            measures TBT until Time to Interactive, which only arrives after
            five quiet seconds, so work scheduled at load still lands inside
            the measured window.

            So the libraries wait for the visitor instead. On the first scroll,
            tap, key or pointer move they load and the queue above replays into
            them. Everything that requires interaction to happen at all — every
            form submit, so every conversion — is therefore still tracked. What
            is not tracked is a visitor who leaves without touching the page;
            that trade was made deliberately. The first-party pageview beacon
            is separate and still counts those visits.

            The CSP uses 'strict-dynamic', so scripts injected by this nonce'd
            script inherit its trust. */}
        <Script id="tag-loader" strategy="afterInteractive" nonce={nonce}>
          {`(function(d,w){var fired=false;
var events=['scroll','pointerdown','touchstart','keydown','mousemove'];
function load(src){var j=d.createElement('script');j.async=true;j.src=src;d.head.appendChild(j)}
function fire(){if(fired)return;fired=true;
events.forEach(function(e){w.removeEventListener(e,fire,{capture:true})});
load('https://www.googletagmanager.com/gtm.js?id=${GTM_ID}');
load('https://connect.facebook.net/en_US/fbevents.js')}
events.forEach(function(e){w.addEventListener(e,fire,{once:true,passive:true,capture:true})});
// A restored scroll position, or a scroll that beat this listener, is itself
// the interaction we are waiting for.
if(w.scrollY>0)fire()})(document,window);`}
        </Script>

      </head>
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <noscript>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              height={1}
              width={1}
              alt=""
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          }
        </noscript>
        <PagePerfTracker />
        <ScrollToTopOnNavigate />
        {children}
      </body>
    </html>
  );
}
