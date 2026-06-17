"use client";

import { useState } from "react";
import Image from "next/image";

// Washing Bay Episodes
const videos = [
    {
        id: "DCPNqK8xWDo",
        title: "Episode 1: The Beginning",
        description: "The initial chaotic state before transformation.",
        thumbnail: "https://img.youtube.com/vi/DCPNqK8xWDo/hqdefault.jpg",
    },
    {
        id: "e0OLyEatg5E",
        title: "Episode 2: The Implementation",
        description: "Executing systems and redefining workflows.",
        thumbnail: "https://img.youtube.com/vi/e0OLyEatg5E/maxresdefault.jpg",
    },
    {
        id: "4GrLuFoHRA4",
        title: "Episode 3: The Result",
        description: "A streamlined, efficient washing bay in action.",
        thumbnail: "https://img.youtube.com/vi/4GrLuFoHRA4/maxresdefault.jpg",
    }
];

export default function VideoSection() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    return (
        <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none opacity-40" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-16">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Transformation Series</h2>
                    </div>
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white font-serif">
                        See the Transformation <br />
                        <span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary/80">in Action</span>
                    </h3>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Watch our three-part documentary series on how we turn chaotic business operations into streamlined, highly efficient systems.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
                    {videos.map((video, index) => (
                        <div
                            key={video.id}
                            className="group relative flex flex-col cursor-pointer"
                            onClick={() => setActiveVideo(video.id)}
                        >
                            {/* Video Card */}
                            <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] group-hover:border-primary/30">
                                {/* Thumbnail */}
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

                                {/* Play Button Wrapper */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/90 group-hover:border-primary">
                                        {/* Ping animation on hover */}
                                        <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white ml-1 relative z-10 transition-transform duration-300 group-hover:text-black">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Episode Badge */}
                                <div className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium tracking-wide">
                                    Part 0{index + 1}
                                </div>
                            </div>

                            {/* Text Info Below */}
                            <div className="mt-6 flex flex-col px-2">
                                <h4 className="text-xl md:text-2xl font-semibold text-white group-hover:text-primary transition-colors duration-300 font-serif">
                                    {video.title}
                                </h4>
                                <p className="mt-2 text-neutral-400 text-sm md:text-base leading-relaxed line-clamp-2">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            {activeVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10 animate-in fade-in zoom-in-95 duration-400">
                    <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg md:rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute -top-4 -right-4 md:top-4 md:right-4 z-50 p-3 rounded-full bg-black/80 hover:bg-white/10 text-white/70 hover:text-white backdrop-blur-md transition-all duration-300 border border-white/10"
                            title="Close Video"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            className="w-full h-full absolute inset-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
