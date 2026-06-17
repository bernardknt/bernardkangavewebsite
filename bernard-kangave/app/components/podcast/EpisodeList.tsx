"use client";

import { useState, useRef, useCallback } from "react";
import type { Episode } from "@/lib/rss";
import { Search } from "lucide-react";
import Link from "next/link";

interface EpisodeListProps {
    episodes: Episode[];
    podcastImage: string;
}

const EPISODES_PER_PAGE = 12;

export default function EpisodeList({ episodes, podcastImage }: EpisodeListProps) {
    const [search, setSearch] = useState("");
    const [showCount, setShowCount] = useState(EPISODES_PER_PAGE);
    const [playingGuid, setPlayingGuid] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const filtered = episodes.filter((ep) => {
        const q = search.toLowerCase();
        return (
            ep.title.toLowerCase().includes(q) ||
            ep.description.toLowerCase().includes(q)
        );
    });

    const visible = filtered.slice(0, showCount);
    const hasMore = showCount < filtered.length;

    const toggleEpisode = useCallback(
        (guid: string, audioUrl: string) => {
            if (playingGuid === guid) {
                audioRef.current?.pause();
                setPlayingGuid(null);
            } else {
                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    audioRef.current.play();
                }
                setPlayingGuid(guid);
            }
        },
        [playingGuid]
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <section id="episodes" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
                        All Episodes
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
                        Explore the Archive
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Browse all episodes, search by topic, and start listening.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-12">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search episodes..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowCount(EPISODES_PER_PAGE);
                            }}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-base"
                        />
                    </div>
                </div>

                {/* Hidden global audio element */}
                <audio ref={audioRef} preload="none" onEnded={() => setPlayingGuid(null)} />

                {/* Episode Grid */}
                {visible.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-xl">No episodes found.</p>
                        <p className="text-sm mt-2">Try a different search term.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {visible.map((ep, index) => {
                            const isActive = playingGuid === ep.guid;
                            return (
                                <div
                                    key={ep.guid}
                                    className={`group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${isActive
                                        ? "border-primary/40 bg-primary/[0.06] shadow-lg shadow-primary/10"
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-black/20"
                                        }`}
                                    onClick={() => toggleEpisode(ep.guid, ep.audioUrl)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Card Content */}
                                    <div className="p-5 space-y-3">
                                        {/* Meta Row */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                {ep.episodeNumber && (
                                                    <span className="text-primary font-bold">
                                                        EP {ep.episodeNumber}
                                                    </span>
                                                )}
                                                <span>{formatDate(ep.pubDate)}</span>
                                            </div>
                                            {ep.duration && (
                                                <span className="font-mono">{ep.duration}</span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                            {ep.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {ep.description}
                                        </p>

                                        {/* Play indicator & Link */}
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-white/[0.06] text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                                                        }`}
                                                >
                                                    {isActive ? (
                                                        // Animated bars
                                                        <div className="flex items-end gap-[2px] h-3.5">
                                                            <div className="w-[3px] bg-current rounded-full animate-pulse" style={{ height: "60%", animationDelay: "0s" }} />
                                                            <div className="w-[3px] bg-current rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                                                            <div className="w-[3px] bg-current rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {isActive ? "Now Playing" : "Play Episode"}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/podcast/${ep.slug}`}
                                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                className="text-xs font-semibold text-primary hover:text-white transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-white/50"
                                            >
                                                Show Notes →
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Active border accent */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setShowCount((c) => c + EPISODES_PER_PAGE)}
                            className="px-8 py-3 text-sm font-semibold text-foreground border border-border rounded-full hover:bg-muted hover:border-primary transition-all"
                        >
                            Load More Episodes ({filtered.length - showCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
