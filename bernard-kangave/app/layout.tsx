import type { Metadata } from "next";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "./components/AnalyticsTracker";

// ----------------------------------------------------
// 1. JSON-LD SCHEMA: FOR GOOGLE RICH RESULTS THUMBNAIL
// ----------------------------------------------------
function generateSchemaData() {
  // ⚠️ NOTE: You may want to update the 'sameAs' links below to your real social profiles.
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Bernard Kangave",
    "jobTitle": "Business Systems Architect",
    "url": "https://bernardkangave.com",
    "image": "https://bernardkangave.com/bernard-profile-photo.jpg",
    "sameAs": [
      "https://www.linkedin.com/in/bernard-kangave-a2b67370/",
      "https://x.com/bernardknt",
      // Add other social media links here
    ],
  });
}
// ----------------------------------------------------


// --- Font Definitions (Preserving your exact imports) ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});
// --------------------------------------------------------


// ----------------------------------------------------
// 2. METADATA: FOR OPEN GRAPH AND SEO
// ----------------------------------------------------
export const metadata: Metadata = {
  // CRITICAL: Tells Next.js the absolute base URL for all relative assets
  metadataBase: new URL('https://bernardkangave.com'),

  title: "Bernard Kangave | Business Systems Architect",
  description: "My mission is to help entrepreneurs move from overwhelmed technicians to confident, systems-driven leaders.",

  openGraph: {
    title: "Bernard Kangave | Business Systems Architect",
    description: "My mission is to help entrepreneurs move from overwhelmed technicians to confident, systems-driven leaders.",
    url: 'https://bernardkangave.com',
    siteName: 'Bernard Kangave',
    images: [
      {
        url: '/bernard-profile-photo.jpg', // Relative path works thanks to metadataBase
        width: 400,
        height: 210,
        alt: 'Bernard Kangave - Business Systems Architect',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: "Bernard Kangave | Business Systems Architect",
    description: "Helping entrepreneurs build systems-driven businesses.",
    // Twitter will now automatically use the image defined in openGraph
  },
};
// ----------------------------------------------------


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ⚠️ This script enables the Schema Rich Results for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateSchemaData() }}
        />
        {/* RSS Feed for Google Podcasts discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Built Not Hustled Podcast"
          href="https://anchor.fm/s/10f8c903c/podcast/rss"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased`}
      >
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const greatVibes = Great_Vibes({
//   weight: "400",
//   variable: "--font-great-vibes",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Bernard Kangave | Business Systems Architect",
//   description: "My mission is to help entrepreneurs move from overwhelmed technicians to confident, systems-driven leaders.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
