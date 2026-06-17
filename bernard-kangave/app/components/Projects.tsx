

const projects = [
    {
        title: "Project One",
        description: "A modern web application built with Next.js and Tailwind CSS.",
        image: "/placeholder-project.jpg", // Placeholder, would need real images
        tags: ["Next.js", "React", "Tailwind"],
        link: "#",
    },
    {
        title: "Project Two",
        description: "Full-stack dashboard with real-time data visualization.",
        image: "/placeholder-project.jpg",
        tags: ["TypeScript", "D3.js", "Supabase"],
        link: "#",
    },
    {
        title: "Project Three",
        description: "Mobile-first e-commerce platform with seamless checkout.",
        image: "/placeholder-project.jpg",
        tags: ["React Native", "Stripe", "Node.js"],
        link: "#",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 px-6 bg-muted/30">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                        Featured Projects
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A selection of projects that demonstrate my passion for building high-quality software.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors"
                        >
                            <div className="aspect-video w-full bg-muted relative">
                                {/* Placeholder for project image */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-xs font-medium bg-muted rounded-md"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <a href={project.link} className="absolute inset-0 z-10">
                                <span className="sr-only">View Project</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
