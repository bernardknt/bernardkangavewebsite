import Image from "next/image";

interface PodcastAboutProps {
    author: string;
    description: string;
    imageUrl: string;
}

export default function PodcastAbout({ author, description, imageUrl }: PodcastAboutProps) {
    return (
        <section id="about-podcast" className="py-24 px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-secondary/5 to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                    {/* Host Photo */}
                    <div className="relative group flex-shrink-0">
                        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                        <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src={imageUrl}
                                alt={author}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
                                Meet Your Host
                            </h2>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                {author}
                            </h3>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                            <a
                                href="/#about"
                                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60"
                            >
                                Learn more about {author.split(" ")[0]} →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
