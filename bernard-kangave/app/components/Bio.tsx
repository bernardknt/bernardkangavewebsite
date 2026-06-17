import Image from "next/image";

export default function Bio() {
    return (
        <section id="about" className="py-24 px-6 bg-muted/30" aria-labelledby="about-title">
            <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 items-center">

                {/* IMAGE */}
                <div className="relative h-full min-h-[400px] md:min-h-[720px] md:col-span-3 rounded-2xl overflow-hidden">
                    <Image
                        src="/bernard_site.png"
                        alt="Bernard Ntege Kangave — Business Systems Coach"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>

                {/* TEXT */}
                <div className="md:col-span-2 space-y-8">
                    <h2 id="about-title" className="text-sm font-bold tracking-widest text-primary uppercase">
                        Who I Am
                    </h2>

                    <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                        Helping small businesses run like big businesses — through systems.
                    </h3>

                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            Every small business deserves systems that give them control, credibility, and peace of mind.
                        </p>
                        <p>
                            My mission is to help entrepreneurs move from overwhelmed technicians to confident,
                            systems-driven leaders. I build technology and frameworks that let businesses
                            operate with structure, stability, and freedom.
                        </p>

                        <blockquote className="pl-6 border-l-4 border-primary italic text-foreground">
                            &quot;The key to freedom isn&apos;t hard work — it&apos;s structure.&quot;
                        </blockquote>
                    </div>
                </div>

            </div>
        </section>
    );
}