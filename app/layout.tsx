import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

const geistSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0d1d33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Ali Andrei Tanting",
  description:
    "Computer Science student at the Polytechnic University of the Philippines, research-focused, practicing AI-native development.",
  metadataBase: new URL("https://ali-tanting.pages.dev"),
  alternates: {
    canonical: "https://ali-tanting.pages.dev",
  },
  authors: [{ name: "Ali Andrei Tanting" }],
  creator: "Ali Andrei Tanting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ali-tanting.pages.dev",
    title: "Ali Andrei Tanting",
    description:
      "Computer Science student at PUP Manila, research-focused, practicing AI-native development.",
    siteName: "Ali Andrei Tanting",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Andrei Tanting",
    description:
      "Computer Science student at PUP Manila, research-focused, practicing AI-native development.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`ocean ${geistMono.variable} ${geistSans.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="scroll-smooth overflow-x-clip bg-background text-foreground font-geistMono">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
