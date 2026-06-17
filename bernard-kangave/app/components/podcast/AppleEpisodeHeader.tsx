"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Episode } from "@/lib/rss";
import ShareButtons from "../blog/ShareButtons";
import EpisodeLikeButton from "./EpisodeLikeButton";
import { PodcastAnalyticsTracker } from "@/lib/podcastAnalytics";

interface AppleEpisodeHeaderProps {
    episode: Episode;
    podcastImage: string;
    autoPlay?: boolean;
}

export default function AppleEpisodeHeader({ episode, podcastImage, autoPlay = false }: AppleEpisodeHeaderProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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
            month: "short",
            day: "numeric",
        })
        : "";

    return (
        <section className="pt-24 pb-12 px-6 border-b border-border/40">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-start">

                {/* Artwork */}
                <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative shadow-primary/10 border border-white/5 bg-muted/20">
                        <img
                            src={episode.imageUrl || podcastImage}
                            alt={episode.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content & Player */}
                <div className="flex-1 flex flex-col pt-2">
                    {/* Meta information */}
                    <div className="flex gap-2 items-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
                        <span className="text-primary tracking-widest">{formattedDate}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-2">
                        {episode.title}
                    </h1>

                    <div className="text-lg text-muted-foreground mb-8 line-clamp-2">
                        {episode.duration && (
                            <span className="mr-3">{episode.duration}</span>
                        )}
                        {episode.episodeNumber && (
                            <span className="mr-3">EP {episode.episodeNumber}</span>
                        )}
                    </div>

                    {/* Player Controls */}
                    <div className="flex flex-col gap-6 mt-auto">
                        <audio ref={audioRef} src={episode.audioUrl} preload="metadata" autoPlay={autoPlay} />

                        {/* Progress slider hidden or subtle in Apple style, let's keep it subtle */}
                        <div className="relative group/slider w-full max-w-md">
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:opacity-0 
                                group-hover/slider:[&::-webkit-slider-thumb]:opacity-100 transition-opacity"
                                style={{
                                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
                                }}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-medium mt-2">
                                <span>{formatTime(currentTime)}</span>
                                <span>-{formatTime(duration - currentTime)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={togglePlay}
                                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-base md:text-lg shadow-lg shadow-primary/20 active:scale-95"
                            >
                                {isPlaying ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                        </svg>
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                        </svg>
                                        {currentTime > 0 ? "Resume" : "Play"}
                                    </>
                                )}
                            </button>

                            {/* Secondary Actions */}
                            <div className="flex items-center gap-2 ml-4">
                                <EpisodeLikeButton slug={episode.slug} />
                                <div className="h-4 w-px bg-border/40 mx-2"></div>
                                <ShareButtons
                                    title={episode.title}
                                    url={typeof window !== "undefined" ? undefined : `https://bernardkangave.com/podcast/${episode.slug}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
