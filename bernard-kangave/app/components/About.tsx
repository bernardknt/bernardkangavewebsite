export default function About() {
    return (
        <section id="about" className="py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center">
                    About Me
                </h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4 text-muted-foreground text-lg">
                        <p>
                            I am a dedicated developer with a knack for solving complex problems and creating intuitive user interfaces. My journey in tech has been driven by a curiosity to understand how things work and a desire to build tools that make life easier.
                        </p>
                        <p>
                            When I&apos;m not coding, I&apos;m exploring new technologies, contributing to open source, or refining my design skills. I believe in the power of continuous learning and sharing knowledge with the community.
                        </p>
                    </div>
                    <div className="p-6 bg-muted/50 rounded-2xl border border-border">
                        <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Git"].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 text-sm font-medium bg-background border border-border rounded-full"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
