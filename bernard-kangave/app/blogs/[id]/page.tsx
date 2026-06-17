import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from "next";

// Force dynamic since we depend on real-time DB data that changes and we want fresh metadata
export const dynamic = 'force-dynamic';

// Helper to fetch data
async function getBlogPost(id: string) {
    try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data: any = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                // Serialize Firestore Timestamp to ISO string to avoid serialization errors passing to Client Component
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching blog post server-side:", error);
        return null;
    }
}

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post: any = await getBlogPost(id);

    if (!post) {
        return {
            title: "Post Not Found | Bernard Kangave",
        };
    }

    return {
        title: `${post.title}`,
        description: post.excerpt || post.content?.substring(0, 160).replace(/[#*`]/g, '') || "Read this article on Bernard Kangave's blog.",
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content?.substring(0, 160).replace(/[#*`]/g, ''),
            images: post.imageUrl ? [{
                url: post.imageUrl,
                width: 1200,
                height: 630,
                alt: post.title
            }] : [],
            type: "article",
            authors: [post.author || "Bernard Kangave"],
            siteName: "Bernard Kangave",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || post.content?.substring(0, 160).replace(/[#*`]/g, ''),
            images: post.imageUrl ? [post.imageUrl] : [],
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { id } = await params;
    const post = await getBlogPost(id);

    return <BlogPostClient initialPost={post} />;
}
