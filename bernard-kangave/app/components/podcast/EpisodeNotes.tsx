export default function EpisodeNotes({ description }: { description: string }) {
    return (
        <section className="py-20 px-6 max-w-4xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-4">
                    Show Notes
                </h2>
                <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors">
                    {description.split("\n\n").map((para, i) => (
                        <p key={i} className="text-muted-foreground whitespace-pre-wrap">
                            {para}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
