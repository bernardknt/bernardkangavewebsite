export default function Testimonials() {
    return (
        <section className="py-24 px-6 bg-muted/30">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Testimonials</h2>
                    <h3 className="text-4xl md:text-5xl font-bold">What Entrepreneurs Say</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            quote: "Bernard transformed our chaotic operations into a streamlined machine. We finally have peace of mind.",
                            author: "Rhoda N.",
                            role: "Washing Bay Owner",
                        },
                        {
                            quote: "The School of Systems bootcamp was a game changer. I stopped being a technician and became a CEO.",
                            author: "David M.",
                            role: "Tech Entrepreneur",
                        },
                        {
                            quote: "Business Pilot saved us hours every week on invoicing and inventory. Highly recommended!",
                            author: "Grace L.",
                            role: "Restaurant Manager",
                        },
                    ].map((testimonial, index) => (
                        <div key={index} className="p-8 rounded-3xl bg-background border border-border shadow-sm">
                            <div className="flex gap-1 text-primary mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-lg text-muted-foreground mb-6">&quot;{testimonial.quote}&quot;</p>
                            <div>
                                <div className="font-bold">{testimonial.author}</div>
                                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
