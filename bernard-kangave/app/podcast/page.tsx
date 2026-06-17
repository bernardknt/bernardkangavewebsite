import type { Metadata } from "next";
import { fetchPodcastFeed } from "@/lib/rss";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PodcastHero from "@/app/components/podcast/PodcastHero";
import FeaturedEpisode from "@/app/components/podcast/FeaturedEpisode";
import EpisodeList from "@/app/components/podcast/EpisodeList";
import PodcastSubscribe from "@/app/components/podcast/PodcastSubscribe";
import PodcastAbout from "@/app/components/podcast/PodcastAbout";
import VideoSection from "@/app/components/VideoSection";

// ─── SEO Metadata ────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
    const feed = await fetchPodcastFeed();
    const seoTitle = `${feed.title} | African Business Systemization Podcast — Bernard Kangave`;
    const seoDescription = `Africa's leading podcast on business systemization. Bernard Kangave helps entrepreneurs build scalable, systems-driven businesses across Africa. Listen to actionable insights on operations, automation, and growth strategies.`;

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: [
            "Bernard Kangave",
            "African business systemization",
            "business systems Africa",
            "Built Not Hustled",
            "business podcast Africa",
            "entrepreneur podcast Uganda",
            "systems-driven business",
            "business automation Africa",
            "African entrepreneur",
            "business operations podcast",
            "scalable business Africa",
        ],
        alternates: {
            canonical: "https://bernardkangave.com/podcast",
        },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: "https://bernardkangave.com/podcast",
            siteName: "Bernard Kangave",
            images: [
                {
                    url: "https://bernardkangave.com/podcast.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${feed.title} — Bernard Kangave's Business Systemization Podcast`,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: seoDescription,
        },
    };
}

// ─── JSON-LD Schema ──────────────────────────────────────
function generatePodcastSchema(feed: Awaited<ReturnType<typeof fetchPodcastFeed>>) {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "PodcastSeries",
        name: feed.title,
        description: feed.description,
        url: "https://bernardkangave.com/podcast",
        image: "https://bernardkangave.com/podcast.jpg",
        webFeed: "https://anchor.fm/s/10f8c903c/podcast/rss",
        author: {
            "@type": "Person",
            name: "Bernard Kangave",
            url: "https://bernardkangave.com",
            jobTitle: "Business Systems Architect",
            sameAs: [
                "https://www.linkedin.com/in/bernard-kangave-a2b67370/",
                "https://x.com/bernardknt",
            ],
        },
        publisher: {
            "@type": "Person",
            name: "Bernard Kangave",
            url: "https://bernardkangave.com",
        },
        inLanguage: feed.language,
        genre: feed.categories,
        keywords: "African business systemization, business systems Africa, entrepreneur podcast, Bernard Kangave",
        numberOfEpisodes: feed.episodes.length,
    });
}

// ─── Page Component ──────────────────────────────────────
export default async function PodcastPage() {
    const feed = await fetchPodcastFeed();
    const latestEpisode = feed.episodes[0] || null;
    const remainingEpisodes = feed.episodes.slice(1);

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: generatePodcastSchema(feed) }}
            />

            <Header />

            <PodcastHero
                title={feed.title}
                description={feed.description}
                imageUrl={feed.imageUrl}
                episodeCount={feed.episodes.length}
                categories={feed.categories}
            />

            {latestEpisode && (
                <FeaturedEpisode
                    episode={latestEpisode}
                    podcastImage={feed.imageUrl}
                />
            )}

            {remainingEpisodes.length > 0 && (
                <EpisodeList
                    episodes={remainingEpisodes}
                    podcastImage={feed.imageUrl}
                />
            )}

            <PodcastSubscribe />

            <PodcastAbout
                author={feed.author}
                description={feed.description}
                imageUrl="/bernard-profile-photo.jpg"
            />

            <VideoSection />

            <Footer />
        </main>
    );
}
