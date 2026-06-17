import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, User } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    imageUrl?: string;
    createdAt?: any;
    author?: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
    // Format date safely
    const date = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Just now';

    return (
        <article className="group relative flex flex-col h-full bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                {post.imageUrl ? (
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-white/5">
                        <span className="text-4xl opacity-20">✍️</span>
                    </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-6 relative">
                {/* Meta tags */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-primary/10">
                        <Calendar className="w-3 h-3" />
                        {date}
                    </div>
                    {/* <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {post.author || "Admin"}
            </div> */}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Footer Link */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center">
                    <span className="text-sm font-semibold text-white/80 group-hover:text-primary transition-colors flex items-center gap-2">
                        Read Article <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </div>
            </div>

            {/* Correct link wrapper */}
            <Link href={`/blogs/${post.id}`} className="absolute inset-0 z-10" aria-label={`Read ${post.title}`}>
            </Link>
        </article>
    );
}
