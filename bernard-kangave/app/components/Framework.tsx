export default function Framework() {
    return (
        <section className="py-24 px-6 bg-secondary text-secondary-foreground">
            <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">The Framework</h2>
                    <h3 className="text-4xl md:text-5xl font-bold">From Chaos to Control</h3>
                    <p className="text-xl max-w-2xl mx-auto text-white/80">
                        A proven path to shift from an overwhelmed technician to a systems-driven leader.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { step: "01", title: "Mindset Shift", desc: "Fixing the owner's thinking to embrace structure over hustle." },
                        { step: "02", title: "Workflow Mapping", desc: "Understanding your numbers, patterns, and current workflows." },
                        { step: "03", title: "Automation", desc: "Implementing simple tools to unlock exponential improvement." },
                        { step: "04", title: "Freedom", desc: "Eliminating reliance on the owner and building a durable business." },
                    ].map((item, index) => (
                        <div key={index} className="group relative p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/50 hover:-translate-y-1">
                            <div className="absolute -right-4 -top-4 text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/5 via-white/20 to-white/5 animate-flux opacity-50 select-none pointer-events-none group-hover:opacity-80 transition-opacity">
                                {item.step}
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-2xl font-bold mb-3 text-primary">{item.title}</h4>
                                <p className="text-white/70 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
