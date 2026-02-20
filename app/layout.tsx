import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Loader } from "@/components/loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://dnowdd.com";

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
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "David Queiroz",
      url: siteUrl,
      email: "david.queiroz@dnowdd.com",
      jobTitle: "Desenvolvedor Full-Stack Júnior",
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Loader />
        {children}
      </body>
    </html>
  );
}
