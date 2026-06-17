"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BlogCard from "./BlogCard";
// import UploadBlogModal from "./UploadBlogModal"; // Moved to page.tsx
import { Loader2 } from "lucide-react";

export default function BlogList() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for blog posts
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

        // Using onSnapshot for real-time updates (User asked to pick from list after upload immediately)
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBlogs(posts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Latest Updates
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                        Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Stories</span>
                    </h1>
                    <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl">
                        Explore thoughts on business architecture, leadership systems, and the journey of building scalable enterprises.
                    </p>
                </div>

                <div className="flex-shrink-0">
                    {/* Upload modal moved to footer */}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {blogs.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}

                    {blogs.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-center text-muted-foreground bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Loader2 className="w-8 h-8 opacity-20" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No stories yet</h3>
                            <p>Be the first to publish an insight.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
