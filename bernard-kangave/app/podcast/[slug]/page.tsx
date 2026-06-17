import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPodcastFeed, getEpisodeBySlug } from "@/lib/rss";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppleEpisodeHeader from "@/app/components/podcast/AppleEpisodeHeader";
import EpisodeNotes from "@/app/components/podcast/EpisodeNotes";
import EpisodeList from "@/app/components/podcast/EpisodeList";
import PodcastSubscribe from "@/app/components/podcast/PodcastSubscribe";
import VideoSection from "@/app/components/VideoSection";

// Required for static export (if deploying to Firebase Hosting or Vercel w/ static export)
export async function generateStaticParams() {
    const feed = await fetchPodcastFeed();
    return feed.episodes.map((ep) => ({
        slug: ep.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const data = await getEpisodeBySlug(resolvedParams.slug);
    if (!data) return {};

    const { episode, podcastFeed } = data;
    const ogImageUrl = "https://bernardkangave.com/podcast.jpg";

    const formattedDate = episode.pubDate
        ? new Date(episode.pubDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
        })
        : "";

    const cleanDuration = episode.duration ? episode.duration.split(":")[0] + "m" : "";
    let ogDescription = `Podcast Episode · ${podcastFeed.title}`;
    if (formattedDate) ogDescription += ` · ${formattedDate}`;
    if (cleanDuration) ogDescription += ` · ${cleanDuration}`;
    const descSnippet = episode.description.substring(0, 100);
    ogDescription += ` | ${descSnippet}...`;

    const seoTitle = `${episode.title} | Built Not Hustled — Bernard Kangave Podcast`;
    const seoDescription = `${ogDescription} African business systemization insights from Bernard Kangave.`;

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: [
            "Bernard Kangave",
            "Built Not Hustled",
            "African business systemization",
            "business systems Africa",
            "business podcast Africa",
            episode.title,
        ],
        alternates: {
            canonical: `https://bernardkangave.com/podcast/${episode.slug}`,
        },
        openGraph: {
            title: episode.title,
            description: seoDescription,
            type: "music.song",
            url: `https://bernardkangave.com/podcast/${episode.slug}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 800,
                    height: 800,
                    alt: `${episode.title} — Bernard Kangave Podcast`,
                },
            ],
            audio: [
                {
                    url: episode.audioUrl,
                    type: "audio/mpeg",
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: episode.title,
            description: seoDescription,
            images: [ogImageUrl],
        },
    };
}

export default async function EpisodePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const data = await getEpisodeBySlug(resolvedParams.slug);

    if (!data) {
        notFound();
    }

    const { episode, podcastFeed } = data;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        "url": `https://bernardkangave.com/podcast/${episode.slug}`,
        "name": episode.title,
        "description": episode.description,
        "datePublished": episode.pubDate,
        "image": "https://bernardkangave.com/podcast.jpg",
        "timeRequired": episode.duration ? `PT${episode.duration.replace(":", "M")}S` : undefined,
        "keywords": "African business systemization, business systems Africa, Bernard Kangave",
        "author": {
            "@type": "Person",
            "name": "Bernard Kangave",
            "url": "https://bernardkangave.com",
            "jobTitle": "Business Systems Architect",
            "sameAs": [
                "https://www.linkedin.com/in/bernard-kangave-a2b67370/",
                "https://x.com/bernardknt",
            ],
        },
        "associatedMedia": {
            "@type": "MediaObject",
            "contentUrl": episode.audioUrl,
        },
        "partOfSeries": {
            "@type": "PodcastSeries",
            "name": podcastFeed.title,
            "url": "https://bernardkangave.com/podcast",
            "image": "https://bernardkangave.com/podcast.jpg",
            "webFeed": "https://anchor.fm/s/10f8c903c/podcast/rss",
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header />

            <main className="flex-1 pb-20">
                <AppleEpisodeHeader episode={episode} podcastImage={podcastFeed.imageUrl} autoPlay={true} />

                <EpisodeNotes description={episode.description} />

                {/* Other Episodes */}
                {podcastFeed.episodes.length > 1 && (
                    <div className="mt-10 border-t border-border/40">
                        <EpisodeList
                            episodes={podcastFeed.episodes.filter(ep => ep.slug !== episode.slug)}
                            podcastImage={podcastFeed.imageUrl}
                        />
                    </div>
                )}

                <PodcastSubscribe />
                <VideoSection />
            </main>

            <Footer />
        </div>
    );
}
