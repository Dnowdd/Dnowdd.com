import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Loader } from "@/components/loader";
import { MotionProvider } from "@/components/motion-provider";
import texts from "@/content/texts.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://dnowdd.com";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "David Queiroz | Dnowdd.com",
    template: "%s | David Queiroz",
  },
  description:
    "Portfólio de David Queiroz — Desenvolvedor Full-Stack com experiência em React, TypeScript e Node.js. Projetos, experiência na Genialogic e formação em Gestão da TI pela FATEC Campinas.",
  keywords: [
    "David Queiroz",
    "desenvolvedor full-stack",
    "desenvolvedor React",
    "TypeScript",
    "Node.js",
    "portfólio desenvolvedor",
    "Genialogic",
    "FATEC Campinas",
    "desenvolvedor brasileiro",
    "front-end",
    "back-end",
  ],
  authors: [{ name: "David Queiroz", url: siteUrl }],
  creator: "David Queiroz",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "David Queiroz | Dnowdd.com",
    title: "David Queiroz | Dnowdd.com",
    description:
      "Portfólio de David Queiroz — Desenvolvedor Full-Stack. Projetos em React, TypeScript, Node.js e experiência na Genialogic.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "David Queiroz — Desenvolvedor Full-Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Queiroz | Dnowdd.com",
    description:
      "Portfólio de David Queiroz — Desenvolvedor Full-Stack. React, TypeScript, Node.js.",
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
    canonical: siteUrl,
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "David Queiroz | Dnowdd.com",
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "David Queiroz",
      alternateName: "Dnowdd",
      url: siteUrl,
      image: "https://github.com/Dnowdd.png",
      email: "david.queiroz@dnowdd.com",
      jobTitle: "Desenvolvedor Full-Stack Júnior",
      description:
        "Desenvolvedor full-stack brasileiro com experiência prática desde 2020, especializado em React, TypeScript e Node.js.",
      worksFor: {
        "@type": "Organization",
        name: "Genialogic",
      },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "FATEC Campinas" },
        { "@type": "School", name: "ETEC de Hortolândia" },
      ],
      knowsAbout: [
        "React",
        "TypeScript",
        "Node.js",
        "Next.js",
        "Desenvolvimento Full-Stack",
      ],
      sameAs: [
        "https://www.linkedin.com/in/dnowdd",
        "https://github.com/Dnowdd",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "David Queiroz | Dnowdd.com",
      description:
        "Portfólio de David Queiroz — Desenvolvedor Full-Stack com experiência em React, TypeScript e Node.js.",
      inLanguage: "pt-BR",
      author: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Projetos de David Queiroz",
      itemListElement: texts.projects.items.map((project, index) => {
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
            image: `${siteUrl}${encodeURI(project.image)}`,
            author: { "@id": `${siteUrl}/#person` },
            keywords: project.tags.join(", "),
            ...(repo && { codeRepository: repo }),
          },
        };
      }),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>
          <Loader />
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
