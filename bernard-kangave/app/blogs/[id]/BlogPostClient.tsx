"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { updateDoc, increment } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Playfair_Display, Merriweather } from "next/font/google";
import CommentsSection from "@/app/components/blog/CommentsSection";
import ShareButtons from "@/app/components/blog/ShareButtons";
import WhatsAppCommunityCTA from "@/app/components/blog/WhatsAppCommunityCTA";
import VideoSection from "@/app/components/VideoSection";


const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"], variable: '--font-merriweather' });

export default function BlogPostClient({ initialPost }: { initialPost?: any }) {
    const { id } = useParams();
    const [post, setPost] = useState<any>(initialPost || null);
    const [loading, setLoading] = useState(!initialPost);
    const [likes, setLikes] = useState(initialPost?.likes || 0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Only fetch if we didn't get initial data
        if (!initialPost) {
            const fetchPost = async () => {
                try {
                    const docRef = doc(db, "blogs", id as string);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPost({ id: docSnap.id, ...data });
                        setLikes(data.likes || 0);
                    } else {
                        setPost(null);
                    }
                } catch (e) {
                    console.error("Error fetching post", e);
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }

        // Simple local check for "liked" state in this session
        const likedKey = `liked_${id}`;
        if (typeof window !== "undefined" && localStorage.getItem(likedKey)) {
            setIsLiked(true);
        }
    }, [id, initialPost]);

    const handleLike = async () => {
        if (!id || isLiked) return;

        // Optimistic update
        setLikes((prev: number) => prev + 1);
        setIsLiked(true);
        if (typeof window !== "undefined") {
            localStorage.setItem(`liked_${id}`, "true");
        }

        try {
            const docRef = doc(db, "blogs", id as string);
            await updateDoc(docRef, {
                likes: increment(1)
            });
        } catch (error) {
            console.error("Error liking post:", error);
            // Revert if failed
            setLikes((prev: number) => prev - 1);
            setIsLiked(false);
            localStorage.removeItem(`liked_${id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white flex flex-col text-gray-900">
                <Header />
                <div className="h-24 md:h-32" />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl font-bold mb-4 font-serif">Post Not Found</h1>
                    <p className="text-gray-500 mb-8">The story you are looking for does not exist.</p>
                    <Link href="/blogs" className="text-black hover:underline flex items-center gap-2 font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    let dateObj;
    if (post.createdAt?.toDate) {
        dateObj = post.createdAt.toDate();
    } else if (typeof post.createdAt === "string") {
        dateObj = new Date(post.createdAt);
    }

    const date = dateObj ? dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Just now';

    const contentParagraphs = (post.content || '').split(/\n\s*\n/);

    return (
        <main
            className={`${playfair.variable} ${merriweather.variable} min-h-screen bg-white text-gray-900 selection:bg-yellow-100 selection:text-black`}
            style={{
                "--background": "#ffffff",
                "--foreground": "#1a1a1a",
                "--muted": "#f3f4f6",
                "--muted-foreground": "#6b7280",
                "--border": "#e5e7eb",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any}
        >
            <Header />

            <div className="h-24" />

            <article className="pb-32">

                {/* Header / Meta */}
                <div className="max-w-[680px] mx-auto px-6 mb-10 mt-10">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-gray-900 font-serif tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                <span className="font-bold text-gray-400 text-lg">BK</span>
                            </div>
                            <div className="flex flex-col text-sm">
                                <span className="font-medium text-gray-900">{post.author || "Bernard Kangave"}</span>
                                <span className="text-gray-500 flex items-center gap-2">
                                    {date} · 5 min read
                                </span>
                            </div>
                        </div>

                        {/* Like Button */}
                        <div className="flex items-center gap-6 text-gray-500">
                            <button
                                onClick={handleLike}
                                disabled={isLiked}
                                className={`flex items-center gap-2 text-sm font-medium transition-all group ${isLiked ? 'text-red-600' : 'hover:text-red-600'}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`} />
                                <span>{likes}</span>
                            </button>
                        </div>
                    </div>
                    {/* Share Buttons */}
                    <ShareButtons title={post.title} />
                </div>

                {/* Featured Image */}
                {post.imageUrl && (
                    <div className="w-full max-w-[800px] mx-auto px-0 md:px-6 mb-12">
                        <div className="relative aspect-[16/9] w-full bg-gray-50 md:rounded-lg overflow-hidden shadow-sm">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className="max-w-[680px] mx-auto px-6">
                    {/* Advanced Custom Renderer */}
                    {(() => {
                        // Only split if content exists
                        if (!post.content) return null;

                        // First, split content into lines to handle block-level elements
                        const lines = post.content.split('\n');

                        return lines.map((line: string, idx: number) => {
                            const trimmed = line.trim();
                            if (!trimmed) return <br key={idx} className="block content-[''] h-4" />;

                            // 1. HEADERS (## Title)
                            if (trimmed.startsWith('## ')) {
                                return (
                                    <h2 key={idx} className="text-2xl md:text-3xl font-bold mt-8 mb-3 font-serif text-gray-900 leading-tight">
                                        {trimmed.replace('## ', '')}
                                    </h2>
                                );
                            }

                            // 2. BLOCKQUOTES (> Quote)
                            if (trimmed.startsWith('> ')) {
                                return (
                                    <blockquote key={idx} className="border-l-4 border-primary/80 pl-5 my-6 py-1 italic text-lg text-gray-800 leading-relaxed font-serif bg-gray-50 rounded-r-lg">
                                        "{trimmed.replace('> ', '')}"
                                    </blockquote>
                                );
                            }

                            // 3. LISTS (- Item)
                            if (trimmed.startsWith('- ')) {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div key={idx} className="flex items-start gap-3 mb-2 ml-2">
                                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                        <p className="text-[18px] leading-[1.7] text-gray-800">
                                            {parseInlineFormatting(trimmed.replace('- ', ''))}
                                        </p>
                                    </div>
                                );
                            }

                            // 4. NORMAL PARAGRAPHS
                            return (
                                <p key={idx} className="mb-5 text-[18px] leading-[1.7] text-gray-800 font-serif">
                                    {parseInlineFormatting(trimmed)}
                                </p>
                            );
                        });
                    })()}

                    <hr className="my-16 border-gray-100" />

                    {/* Article Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-16">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                                BK
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Written by Bernard Kangave</h3>
                                <p className="text-gray-600 text-sm max-w-xs">Business Systems Architect.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                disabled={isLiked}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors ${isLiked ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-600'}`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">{likes} Likes</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center mb-10">
                        <ShareButtons title={post.title} />
                    </div>

                    <WhatsAppCommunityCTA />
                </div>

                <VideoSection />

                {/* Comments Section */}
                <CommentsSection blogId={id as string} />

                {/* Floating Like Button (FAB) */}
                <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isLiked
                        ? 'bg-red-500 text-white shadow-red-500/30'
                        : 'bg-white text-gray-800 shadow-gray-200 border border-gray-100 hover:border-red-100 hover:text-red-500'
                        }`}
                    aria-label="Like this post"
                >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    <span className={`font-bold text-lg ${isLiked ? 'text-white' : 'text-gray-900 group-hover:text-red-500'}`}>{likes}</span>
                </button>
            </article>

            <Footer />
        </main>
    );
}

// Helper for inline formatting (Bold **text**, Italic *text*)
function parseInlineFormatting(text: string) {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="italic text-gray-800 font-medium">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
    });
}
