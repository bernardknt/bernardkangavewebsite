interface PodcastSubscribeProps {
    spotifyUrl?: string;
    applePodcastsUrl?: string;
    youtubeUrl?: string;
}

const platforms = [
    {
        name: "Spotify",
        key: "spotifyUrl",
        color: "from-[#1DB954] to-[#1aa34a]",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
        ),
    },
    {
        name: "Apple Podcasts",
        key: "applePodcastsUrl",
        color: "from-[#9933CC] to-[#8B24BD]",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.6.12 2.018 0 2.64-.36 1.86-1.2 3.396-2.508 4.62-1.38 1.296-3.012 2.016-4.86 2.16-.444.036-.552.012-.636-.12-.06-.096-.072-.324-.072-1.608v-1.5l.168-.084c1.308-.66 2.292-1.74 2.784-3.06.276-.744.348-1.164.348-1.968 0-.792-.06-1.14-.324-1.872-.468-1.296-1.392-2.376-2.604-3.024-1.452-.78-3.204-.84-4.716-.168-2.028.9-3.372 2.808-3.516 4.98-.06.924.096 1.74.492 2.592.384.816.852 1.404 1.572 1.98l.252.204.012 1.56c.012 1.476.012 1.56-.06 1.668-.084.132-.156.156-.54.132-1.2-.084-2.4-.564-3.48-1.38-1.236-3.18-2.016-5.232-2.052-.06 0 .12-.456.12-1.092-.012-6.12.024-1.224.072-1.488.444-2.064 1.272-3.624 2.58-4.872C7.512 3.42 9.696 2.568 11.865 2.568zm.084 3.96c1.044 0 2.028.396 2.856 1.152.456.42.744.828 1.032 1.476.3.66.396 1.068.396 1.824 0 .756-.096 1.164-.396 1.824-.288.648-.576 1.056-1.032 1.476-.936.852-2.172 1.272-3.42 1.152-1.56-.144-2.904-1.128-3.468-2.532-.228-.564-.312-.996-.312-1.608 0-.72.072-1.116.336-1.704.564-1.248 1.74-2.148 3.084-2.364.264-.036.66-.036.924.012v-.708zM11.7 14.772c.348 0 .384.012.492.12.108.12.12.168.432 1.776.204 1.02.372 1.908.384 1.98.012.084-.012.24-.048.36-.108.3-.396.504-.696.504h-.012c-.312-.012-.588-.216-.696-.516-.048-.12-.048-.18-.036-.36l.384-1.98c.312-1.608.324-1.656.432-1.764.108-.108.144-.12.492-.12z" />
            </svg>
        ),
    },
];

export default function PodcastSubscribe({
    spotifyUrl = "https://open.spotify.com/show/2xsfOPS9JrhwFO8OeEAE2P?si=0lNwnNifTlyzavXTprvDGw",
    applePodcastsUrl = "https://podcasts.apple.com/ug/podcast/built-not-hustled/id1880601528",
}: PodcastSubscribeProps) {
    const urls: Record<string, string> = {
        spotifyUrl,
        applePodcastsUrl,
    };

    return (
        <section id="subscribe" className="py-24 px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-14 space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
                        Subscribe
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground">
                        Never Miss an Episode
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Follow the podcast on your favorite platform and get notified when new episodes drop.
                    </p>
                </div>

                {/* Platform Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {platforms.map((platform) => (
                        <a
                            key={platform.name}
                            href={urls[platform.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col items-center gap-4 text-center transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
                        >
                            {/* Gradient glow on hover */}
                            <div
                                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none`}
                            />

                            {/* Icon */}
                            <div className="relative text-muted-foreground group-hover:text-white transition-colors duration-300">
                                {platform.icon}
                            </div>

                            {/* Name */}
                            <span className="relative text-sm font-semibold text-foreground">
                                {platform.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
