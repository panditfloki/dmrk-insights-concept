import StockTicker from '@/components/StockTicker';
import { WebsiteProvider } from '@/components/WebsiteProvider';
import { settingsCopy } from '@/lib/website-shared';
import { getWebsite } from '@/lib/website';
import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

// TYPE IS A PROPOSAL, NOT A LOCK. The client locked the COLOUR (#0f67c7), not the
// typeface. Their live site ships raw Arial + Georgia with no webfont — a default,
// not a decision. Self-hosted here via next/font, so no runtime request to Google
// and no layout shift. Reverting is two lines.
const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const serif = Source_Serif_4({ subsets: ["latin"], display: "swap", variable: "--font-serif", weight: ["400", "600", "700"] });

export async function generateMetadata(): Promise<Metadata> {
 const copy=settingsCopy(await getWebsite());
 return {
  title: {
    default: "Market Research & Strategic Consulting | DMRK Insights",
    template: `%s | ${copy('brand')} ${copy('brandSubtitle')}`,
  },
  description:
    "DMRK Insights provides market intelligence, customer research, competitor analysis, surveys, and strategic consulting for confident growth decisions.",
  openGraph: { siteName: `${copy('brand')} ${copy('brandSubtitle')}`, locale: "en_IN", type: "website" },
  // Concept build: must never be indexed.
  metadataBase: new URL("https://dmrkinsights.com"),
  robots: process.env.DMRK_PUBLIC_SITE === "true"
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true, nosnippet: true },
};
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getWebsite();
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <WebsiteProvider site={site}>
        <ScrollProgress />
        <Nav />
        <StockTicker />
        <main>{children}</main>
        <Footer />
        <Motion />
        </WebsiteProvider>
      </body>
    </html>
  );
}
