import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { getDictionary, hasLocale, HTML_LANG, localeAlternates, LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import PagePerfTracker from "@/lib/pagePerf";
import ScrollToTopOnNavigate from "@/app/[lang]/(main)/components/ScrollToTopOnNavigate";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]/ev">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.evTitle,
    description: t.evDescription,
    metadataBase: SITE_URL,
    alternates: localeAlternates(lang, "/ev"),
    verification: {
      google: "FdVlWEEvys2RdCCMKjiAkXv3HGVMWr9foIpy036CmiA",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]/ev">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang={HTML_LANG[lang]} className={`${outfit.variable} ${inter.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive" nonce={nonce}>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-54979CGR');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Meta Pixel Code */}
        <Script id="meta-pixel-init" strategy="afterInteractive" nonce={nonce}>
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '868631075171591');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- Meta Pixel noscript beacon; must hit facebook.com directly, not /_next/image */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=868631075171591&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-54979CGR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <PagePerfTracker />
        <ScrollToTopOnNavigate />
        {children}
      </body>
    </html>
  );
}
