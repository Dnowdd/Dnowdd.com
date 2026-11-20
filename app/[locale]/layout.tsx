import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Loader } from "@/components/loader";
import { MotionProvider } from "@/components/motion-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomCursor } from "@/components/custom-cursor";
import { LanguageSwitcher } from "@/components/language-switcher";
import { routing } from "@/i18n/routing";
import { localeUrl, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { meta } = await getMessages({ locale });
  const url = localeUrl(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: "%s | David Queiroz",
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "David Queiroz", url: SITE_URL }],
    creator: "David Queiroz",
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      url,
      siteName: meta.title,
      title: meta.title,
      description: meta.ogDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.twitterDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((code) => [code, localeUrl(code)]),
        ),
        "x-default": localeUrl(routing.defaultLocale),
      },
    },
    icons: {
      icon: [
        { url: "/bulb.svg" },
        { url: "/bulb.svg", media: "(prefers-color-scheme: light)" },
        { url: "/bulb-light.svg", media: "(prefers-color-scheme: dark)" },
      ],
      apple: "/icon-192.png",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { meta, projects } = await getMessages({ locale });
  const url = localeUrl(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}/#profilepage`,
        url,
        name: meta.title,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "David Queiroz",
        alternateName: "Dnowdd",
        url: SITE_URL,
        image: "https://github.com/Dnowdd.png",
        email: "david.queiroz@dnowdd.com",
        jobTitle: meta.jobTitle,
        description: meta.personDescription,
        worksFor: {
          "@type": "Organization",
          name: "Genialogic",
        },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "FATEC Campinas" },
          { "@type": "School", name: "ETEC de Hortolândia" },
        ],
        knowsAbout: ["React", "TypeScript", "Node.js", "Next.js", meta.knowsAbout],
        sameAs: [
          "https://www.linkedin.com/in/dnowdd",
          "https://github.com/Dnowdd",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: meta.title,
        description: meta.shortDescription,
        inLanguage: routing.locales,
        author: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}/#projects`,
        name: meta.projectsList,
        itemListElement: projects.items.map((project, index) => {
          const repo = (
            project as { links?: { icon: string; url: string }[] }
          ).links?.find((link) => link.icon === "Github")?.url;

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": repo ? "SoftwareSourceCode" : "CreativeWork",
              name: project.title,
              description: project.description,
              image: `${SITE_URL}${encodeURI(project.image)}`,
              author: { "@id": `${SITE_URL}/#person` },
              keywords: project.tags.join(", "),
              ...(repo && { codeRepository: repo }),
            },
          };
        }),
      },
    ],
  };

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark overflow-x-clip font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>
          <MotionProvider>
            <SmoothScroll>
              <Loader />
              <CustomCursor />
              <LanguageSwitcher />
              {children}
            </SmoothScroll>
          </MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
