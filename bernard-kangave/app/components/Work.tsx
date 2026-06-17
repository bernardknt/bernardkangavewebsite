export default function Work() {
    return (
        <section id="work" className="py-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">My Ecosystem</h2>
                    <h3 className="text-4xl md:text-5xl font-bold">Tools for Transformation</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Business Pilot */}
                    <div className="group relative p-8 rounded-3xl bg-muted border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        </div>
                        <h4 className="text-2xl font-bold mb-3">Business Pilot</h4>
                        <p className="text-muted-foreground mb-6">
                            The flagship automation platform. Fast invoicing, inventory management, HR workflows, and AI-powered business assistance.
                        </p>
                        <a href="https://businesspilotapp.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                            Learn more <span className="ml-2">→</span>
                        </a>
                    </div>

                    {/* SOS */}
                    <div className="group relative p-8 rounded-3xl bg-muted border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="h-12 w-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 text-secondary-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <h4 className="text-2xl font-bold mb-3">School of Systems</h4>
                        <p className="text-muted-foreground mb-6">
                            Bootcamps, workshops, and mindset training to help you escape technician mode and build a durable business.
                        </p>
                        <a href="#" className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                            Join the School <span className="ml-2">→</span>
                        </a>
                    </div>

                    {/* Content */}
                    <div className="group relative p-8 rounded-3xl bg-muted border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        </div>
                        <h4 className="text-2xl font-bold mb-3">Content & Media</h4>
                        <p className="text-muted-foreground mb-6">
                            Real business case studies, transformation vlogs, and practical systems education on YouTube and TikTok.
                        </p>
                        <a href="https://www.youtube.com/watch?v=DCPNqK8xWDo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                            Watch Episode 1 <span className="ml-2">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
