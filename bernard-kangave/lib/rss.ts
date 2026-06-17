import { XMLParser } from "fast-xml-parser";

// ─── Types ───────────────────────────────────────────────
export interface Episode {
    title: string;
    description: string;
    pubDate: string;
    duration: string;
    audioUrl: string;
    episodeNumber: number | null;
    imageUrl: string | null;
    link: string;
    guid: string;
    slug: string;
}

export interface PodcastFeed {
    title: string;
    description: string;
    author: string;
    imageUrl: string;
    link: string;
    language: string;
    categories: string[];
    episodes: Episode[];
}

// ─── RSS Feed URL ────────────────────────────────────────
// Replace this with your actual Spotify Creators RSS feed URL
const RSS_FEED_URL =
    process.env.PODCAST_RSS_URL ||
    "https://anchor.fm/s/10f8c903c/podcast/rss";

// ─── Parser ──────────────────────────────────────────────
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
});

function stripHtml(html: string): string {
    return html
        ?.replace(/<[^>]*>/g, "")
        ?.replace(/&amp;/g, "&")
        ?.replace(/&lt;/g, "<")
        ?.replace(/&gt;/g, ">")
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'")
        ?.replace(/&nbsp;/g, " ")
        ?.trim() || "";
}

function parseDuration(raw: string | number | undefined): string {
    if (!raw) return "";
    const val = String(raw);
    // Already formatted (HH:MM:SS or MM:SS)
    if (val.includes(":")) return val;
    // Seconds
    const totalSec = parseInt(val, 10);
    if (isNaN(totalSec)) return val;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

// ─── Fetch & Parse ───────────────────────────────────────
export async function fetchPodcastFeed(): Promise<PodcastFeed> {
    try {
        const res = await fetch(RSS_FEED_URL, {
            next: { revalidate: 3600 }, // ISR: revalidate every hour
        });

        if (!res.ok) {
            throw new Error(`RSS fetch failed: ${res.status}`);
        }

        const xml = await res.text();
        const parsed = parser.parse(xml);
        const channel = parsed?.rss?.channel;

        if (!channel) {
            throw new Error("Invalid RSS feed structure");
        }

        // Parse channel-level data
        const feed: PodcastFeed = {
            title: channel.title || "Podcast",
            description: stripHtml(channel.description || ""),
            author: channel["itunes:author"] || channel["dc:creator"] || "Bernard Kangave",
            imageUrl:
                channel["itunes:image"]?.["@_href"] ||
                channel.image?.url ||
                "/bernard-profile-photo.jpg",
            link: channel.link || "",
            language: channel.language || "en",
            categories: extractCategories(channel),
            episodes: [],
        };

        // Parse episodes
        const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];

        feed.episodes = items.map((item: Record<string, unknown>, index: number) => {
            const enclosure = item.enclosure as Record<string, string> | undefined;
            const itunesImage = item["itunes:image"] as Record<string, string> | undefined;
            const itemTitle = (item.title as string) || `Episode ${items.length - index}`;

            return {
                title: itemTitle,
                description: stripHtml((item.description as string) || (item["itunes:summary"] as string) || ""),
                pubDate: (item.pubDate as string) || "",
                duration: parseDuration(item["itunes:duration"] as string | number | undefined),
                audioUrl: enclosure?.["@_url"] || "",
                episodeNumber: item["itunes:episode"]
                    ? parseInt(String(item["itunes:episode"]), 10)
                    : null,
                imageUrl:
                    itunesImage?.["@_href"] || null,
                link: (item.link as string) || "",
                guid: (item.guid as string) || ((item.guid as Record<string, string>)?.["#text"]) || String(index),
                slug: generateSlug(itemTitle),
            } satisfies Episode;
        });

        return feed;
    } catch (error) {
        console.error("Error fetching podcast RSS feed:", error);
        // Return fallback data so the page still renders
        return {
            title: "Built not Hustled",
            description: "Helping entrepreneurs build systems-driven businesses.",
            author: "Bernard Kangave",
            imageUrl: "/bernard-profile-photo.jpg",
            link: "https://bernardkangave.com/podcast",
            language: "en",
            categories: ["Business", "Entrepreneurship"],
            episodes: [],
        };
    }
}

function extractCategories(channel: Record<string, unknown>): string[] {
    const cats: string[] = [];
    const itunesCat = channel["itunes:category"];
    if (Array.isArray(itunesCat)) {
        itunesCat.forEach((c: Record<string, string>) => {
            if (c?.["@_text"]) cats.push(c["@_text"]);
        });
    } else if (itunesCat && typeof itunesCat === "object") {
        const cat = itunesCat as Record<string, string>;
        if (cat["@_text"]) cats.push(cat["@_text"]);
    }
    return cats.length > 0 ? cats : ["Business"];
}

export async function getEpisodeBySlug(slug: string): Promise<{ episode: Episode; podcastFeed: PodcastFeed } | null> {
    const feed = await fetchPodcastFeed();
    const episode = feed.episodes.find((ep) => ep.slug === slug);
    if (!episode) return null;
    return { episode, podcastFeed: feed };
}
