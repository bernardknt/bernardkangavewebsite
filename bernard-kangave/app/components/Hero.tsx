export default function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 pt-32 md:pt-0 text-center bg-background overflow-hidden">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
            from-secondary/20 via-background to-background opacity-60" />

            <div className="relative z-10 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Identity Pill */}
                <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-border/60 
                text-xs uppercase tracking-[0.2em] mb-2">
                    Bernard Kangave • Systems Architect
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-tight">
                    On a Mission
                </h1>

                {/* Sub-headline */}
                <h2 className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text 
                bg-gradient-to-r from-primary via-white to-primary animate-flux leading-tight">
                    To help small businesses run like big businesses.
                </h2>

                {/* Subtext */}
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
                    Founder — Business Pilot & School of Systems (SOS)
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <a
                        href="#work"
                        className="px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full 
                        hover:bg-primary/90 transition-all transform hover:scale-105"
                    >
                        Explore Systems
                    </a>

                    <a
                        href="mailto:bernardkangave@businesspilotapp.com"
                        className="px-8 py-4 text-lg font-semibold text-foreground border border-border rounded-full 
                        hover:bg-muted transition-all hover:border-primary"
                    >
                        Work With Me
                    </a>
                </div>
            </div>
        </section>
    );
}