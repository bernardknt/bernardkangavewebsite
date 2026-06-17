import { MetadataRoute } from "next";
import { fetchPodcastFeed } from "@/lib/rss";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const feed = await fetchPodcastFeed();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: "https://bernardkangave.com",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1.0,
        },
        {
            url: "https://bernardkangave.com/blogs",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://bernardkangave.com/podcast",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];

    // Dynamic podcast episode pages
    const episodePages: MetadataRoute.Sitemap = feed.episodes.map((episode) => ({
        url: `https://bernardkangave.com/podcast/${episode.slug}`,
        lastModified: episode.pubDate ? new Date(episode.pubDate) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...episodePages];
}
