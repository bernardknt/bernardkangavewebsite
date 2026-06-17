"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Episode } from "@/lib/rss";
import Link from "next/link";
import ShareButtons from "../blog/ShareButtons";
import EpisodeLikeButton from "./EpisodeLikeButton";
import { PodcastAnalyticsTracker } from "@/lib/podcastAnalytics";

interface FeaturedEpisodeProps {
    episode: Episode;
    podcastImage: string;
    autoPlay?: boolean;
}

export default function FeaturedEpisode({ episode, podcastImage, autoPlay = false }: FeaturedEpisodeProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onDurationChange = () => setDuration(audio.duration || 0);
        const onEnded = () => setIsPlaying(false);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onDurationChange);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);

        // Attempt to play if autoPlay is true (browsers might block this without prior interaction)
        if (autoPlay) {
            audio.play().catch((e) => {
                console.log("Autoplay prevented by browser:", e);
                setIsPlaying(false);
            });
        }

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onDurationChange);
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
        };
    }, [autoPlay]);

    // ── Analytics Tracker ──
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const tracker = new PodcastAnalyticsTracker(audio, {
            slug: episode.slug,
            title: episode.title,
        });

        return () => {
            tracker.destroy();
        };
    }, [episode.slug, episode.title]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const time = parseFloat(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const vol = parseFloat(e.target.value);
        audio.volume = vol;
        setVolume(vol);
    };

    function formatTime(sec: number): string {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${String(s).padStart(2, "0")}`;
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formattedDate = episode.pubDate
        ? new Date(episode.pubDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <section id="featured-episode" className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section Label */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
                        Latest Podcast Episode
                    </h2>
                    <div className="w-12 h-0.5 bg-primary/40 mx-auto rounded-full" />
                </div>

                {/* Featured Card */}
                <div className="relative group">
                    {/* Glow */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/10 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                    <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 md:p-10 overflow-hidden">
                        {/* Decorative corner gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative flex flex-col md:flex-row gap-8 items-start">
                            {/* Episode Image */}
                            <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden bg-muted/20 border border-white/5">
                                <img
                                    src={episode.imageUrl || podcastImage}
                                    alt={episode.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Episode Info */}
                            <div className="flex-1 space-y-4 min-w-0">
                                {/* Meta */}
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {episode.episodeNumber && (
                                        <span className="text-primary font-semibold">
                                            EP {episode.episodeNumber}
                                        </span>
                                    )}
                                    {formattedDate && <span>{formattedDate}</span>}
                                    {episode.duration && (
                                        <>
                                            <span className="text-white/20">•</span>
                                            <span>{episode.duration}</span>
                                        </>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                    {episode.title}
                                </h3>

                                {/* Description */}
                                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                    {episode.description}
                                </p>
                            </div>
                        </div>

                        {/* ── Custom Audio Player ── */}
                        <div className="mt-8 space-y-4">
                            <audio ref={audioRef} src={episode.audioUrl} preload="metadata" autoPlay={autoPlay} />

                            {/* Progress Bar */}
                            <div className="relative group/slider">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 0}
                                    step={0.1}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg 
                    [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:transition-opacity
                    group-hover/slider:[&::-webkit-slider-thumb]:opacity-100"
                                    style={{
                                        background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
                                    }}
                                />
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center gap-6">
                                {/* Play/Pause */}
                                <button
                                    onClick={togglePlay}
                                    className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>

                                {/* Time */}
                                <div className="text-sm text-muted-foreground font-mono tabular-nums">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>

                                {/* Volume */}
                                <div className="hidden sm:flex items-center gap-2 ml-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-muted-foreground">
                                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                                    </svg>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={volume}
                                        onChange={handleVolume}
                                        className="w-20 h-1 rounded-full appearance-none cursor-pointer bg-white/10
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                                        style={{
                                            background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Interactive Footer: Like, Share, and View Full Notes */}
                            <div className="pt-4 mt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <EpisodeLikeButton slug={episode.slug} />
                                    <ShareButtons
                                        title={episode.title}
                                        url={typeof window !== "undefined" ? undefined : `https://bernardkangave.com/podcast/${episode.slug}`}
                                    />
                                </div>
                                <Link
                                    href={`/podcast/${episode.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-white/50 whitespace-nowrap"
                                >
                                    View Full Show Notes
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
