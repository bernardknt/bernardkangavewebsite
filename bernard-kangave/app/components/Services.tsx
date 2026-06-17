export default function Services() {
    return (
        <section id="services" className="py-24 px-6 bg-background">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Work With Me</h2>
                        <h3 className="text-4xl md:text-5xl font-bold">Ways we can collaborate</h3>
                        <p className="text-lg text-muted-foreground">
                            Whether you need a deep dive into your business systems or a keynote speaker for your next event, I&apos;m here to help you scale.
                        </p>
                        <a
                            href="mailto:bernardkangave@businesspilotapp.com"
                            className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all"
                        >
                            Get in Touch
                        </a>
                    </div>

                    <div className="space-y-8">
                        {[
                            { title: "Coaching & Consulting", desc: "One-on-one guidance to map your workflows and implement automation." },
                            { title: "SOS Bootcamps", desc: "Intensive workshops designed to transform your business operations in days." },
                            { title: "Masterclasses", desc: "Deep implementation programs for business owners ready to scale." },
                            { title: "Speaking", desc: "Keynotes on business systems, automation, and entrepreneurial transformation." },
                        ].map((service, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="h-2 w-2 mt-2.5 rounded-full bg-primary flex-shrink-0" />
                                <div>
                                    <h4 className="text-xl font-bold">{service.title}</h4>
                                    <p className="text-muted-foreground">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
