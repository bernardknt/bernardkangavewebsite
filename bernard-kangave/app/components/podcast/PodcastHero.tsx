"use client";

import Image from "next/image";

interface PodcastHeroProps {
    title: string;
    description: string;
    imageUrl: string;
    episodeCount: number;
    categories: string[];
}

export default function PodcastHero({
    title,
    description,
    imageUrl,
    episodeCount,
    categories,
}: PodcastHeroProps) {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
            {/* ── Animated Background ── */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary/30 via-background to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                {/* Sound wave bars */}
                <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-center gap-1 opacity-[0.06] pointer-events-none">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1 rounded-full bg-primary"
                            style={{
                                height: `${20 + Math.sin(i * 0.5) * 60 + Math.random() * 40}%`,
                                animation: `soundWave ${1.5 + Math.random() * 1.5}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.05}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* Podcast Artwork */}
                <div className="relative group flex-shrink-0">
                    {/* Glow ring */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/20 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.03]">
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center lg:text-left space-y-6 max-w-2xl">
                    {/* Category badges */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                        {categories.map((cat) => (
                            <span
                                key={cat}
                                className="px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full border border-primary/30 text-primary bg-primary/5"
                            >
                                {cat}
                            </span>
                        ))}
                        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full border border-white/10 text-muted-foreground">
                            {episodeCount} Episode{episodeCount !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1.05]">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed line-clamp-3">
                        {description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                        <a
                            href="#featured-episode"
                            className="group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                            Listen Now
                        </a>
                        <a
                            href="https://podcasts.apple.com/ug/podcast/built-not-hustled/id1880601528"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 text-lg font-semibold text-foreground border border-border rounded-full hover:bg-muted hover:border-primary transition-all"
                        >
                            Subscribe
                        </a>
                    </div>
                </div>
            </div>

            {/* Keyframe style */}
            <style jsx>{`
        @keyframes soundWave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
        </section>
    );
}
