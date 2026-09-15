import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE, HTML_LANG, getDictionary, hasLocale, localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
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

        {/* gtm.js and fbevents.js are ~200KB of third-party JS whose parse and
            execute time lands squarely in Total Blocking Time when it runs
            during load. Deferring the fetch to after the load event keeps the
            main thread free through the measured window; the shim above means
            nothing is missed in the meantime. The CSP uses 'strict-dynamic',
            so scripts injected by this nonce'd script inherit its trust. */}
        <Script id="tag-loader" strategy="lazyOnload" nonce={nonce}>
          {`(function(d){function load(src){var j=d.createElement('script');j.async=true;j.src=src;
d.getElementsByTagName('script')[0].parentNode.insertBefore(j,null)}
load('https://www.googletagmanager.com/gtm.js?id=${GTM_ID}');
load('https://connect.facebook.net/en_US/fbevents.js')})(document);`}
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
        {children}
      </body>
    </html>
  );
}
