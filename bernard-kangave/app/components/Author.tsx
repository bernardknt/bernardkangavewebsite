import Image from "next/image";

export default function Author() {
    return (
        <section id="author" className="py-24 px-6 bg-muted/30">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                {/* Book Cover Placeholder */}
                <div className="relative group order-2 md:order-1">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                    <div className="relative aspect-[2/3] max-w-sm mx-auto bg-gradient-to-br from-neutral-800 to-black rounded-r-2xl rounded-l-sm shadow-2xl border-r-4 border-white/10 flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-y-12">
                        <div className="text-center p-8">
                            <h3 className="text-3xl font-serif text-primary mb-2">The<br />Corporate<br />Farmer</h3>
                            <div className="w-12 h-1 bg-white/20 mx-auto my-4" />
                            <p className="text-white/60 text-sm uppercase tracking-widest">Bernard Kangave</p>
                        </div>
                        {/* Book Spine Effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/10 to-transparent rounded-l-sm" />
                    </div>
                </div>

                <div className="space-y-8 order-1 md:order-2">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Author</h2>
                    <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                        The Corporate Farmer
                    </h3>
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            In a world where business often feels like a chaotic gamble, <em>The Corporate Farmer</em> offers a grounding philosophy: treat your business like a farm, not a casino.
                        </p>
                        <p>
                            This book bridges the gap between the structured discipline of corporate systems and the organic growth of entrepreneurship. It&apos;s a guide for those who want to cultivate a business that yields a harvest year after year, without the burnout.
                        </p>
                    </div>

                    <div className="pt-4">
                        <a
                            href="#"
                            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all transform hover:translate-x-1"
                        >
                            Get the Book
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
