import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ali Andrei L. Tanting | Developer & AI Engineer",
  description:
    "AI-powered developer building intelligent applications, flood-aware commute radars, and transit guides for the Philippines and beyond.",
  keywords: [
    "developer",
    "AI engineer",
    "portfolio",
    "web development",
    "artificial intelligence",
    "Ali Andrei L. Tanting",
    "React Native",
    "TypeScript",
    "Python",
    "LIGTAS METRO",
    "PARA PO",
  ],
  authors: [{ name: "Ali Andrei L. Tanting" }],
  creator: "Ali Andrei L. Tanting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aliandrei.dev",
    title: "Ali Andrei L. Tanting | Developer & AI Engineer",
    description:
      "Portfolio of Ali Andrei L. Tanting — Developer and AI Engineer building intelligent applications with cutting-edge AI tools.",
    siteName: "Ali Andrei L. Tanting Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Andrei L. Tanting | Developer & AI Engineer",
    description:
      "Developer and AI Engineer building intelligent applications with cutting-edge AI tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="canonical" href="https://aliandrei.dev" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-poppins">{children}</body>
    </html>
  );
}