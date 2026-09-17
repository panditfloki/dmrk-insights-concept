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

export const metadata: Metadata = {
  title: {
    default: "Market Research & Strategic Consulting | DMRK Insights",
    template: "%s | DMRK Insights",
  },
  description:
    "DMRK Insights provides market intelligence, customer research, competitor analysis, surveys, and strategic consulting for confident growth decisions.",
  openGraph: { siteName: "DMRK Insights", locale: "en_IN", type: "website" },
  // Concept build: must never be indexed.
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`}>
      <head>
        {/* Sets .js before first paint so the reveal start state applies only when
            JS is actually running. Without this the page must still be readable. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
