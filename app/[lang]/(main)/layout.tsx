import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { LOCALES, HTML_LANG, getDictionary, hasLocale, localePath } from "@/lib/i18n";
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
    alternates: {
      canonical: localePath(lang),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l)])),
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
        <Script id="gtm-script" strategy="afterInteractive" nonce={nonce}>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>

        <Script id="meta-pixel" strategy="afterInteractive" nonce={nonce}>
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
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
