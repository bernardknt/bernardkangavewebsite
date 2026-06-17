export default function Community() {
    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-to-br from-secondary to-black border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

                <div className="relative z-10 space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Join the Movement</h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Connect with thousands of like-minded entrepreneurs mastering business systems. Get exclusive tips, workshop alerts, and more.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                        <a
                            href="https://chat.whatsapp.com/DCsMrBKqZXsDfbj52EEpE6?mode=hqrt2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-black bg-white rounded-full hover:bg-white/90 transition-all"
                        >
                            Join WhatsApp Community
                        </a>
                        <a
                            href="https://businesspilotapp.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all"
                        >
                            Try Business Pilot
                        </a>
                        <a
                            href="https://www.youtube.com/watch?v=DCPNqK8xWDo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all"
                        >
                            Watch Episode 1
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
