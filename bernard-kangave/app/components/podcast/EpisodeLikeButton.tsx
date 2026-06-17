"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Heart } from "lucide-react";

interface EpisodeLikeButtonProps {
    slug: string;
}

export default function EpisodeLikeButton({ slug }: EpisodeLikeButtonProps) {
    const [likes, setLikes] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for previous likes
        if (typeof window !== "undefined") {
            const likedEpisodes = JSON.parse(localStorage.getItem("liked_episodes") || "[]");
            if (likedEpisodes.includes(slug)) {
                setHasLiked(true);
            }
        }

        // Fetch initial likes map
        const fetchLikes = async () => {
            try {
                const docRef = doc(db, "podcast_likes", slug);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLikes(docSnap.data().count || 0);
                }
            } catch (error) {
                console.error("Error fetching likes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikes();
    }, [slug]);

    const handleLike = async () => {
        if (hasLiked) return;

        // Optimistic UI update for immediate feedback
        setHasLiked(true);
        setLikes(prev => prev + 1);

        // Update local storage
        if (typeof window !== "undefined") {
            const likedEpisodes = JSON.parse(localStorage.getItem("liked_episodes") || "[]");
            localStorage.setItem("liked_episodes", JSON.stringify([...likedEpisodes, slug]));
        }

        // Perform Firestore update
        try {
            const docRef = doc(db, "podcast_likes", slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, { count: increment(1) });
            } else {
                await setDoc(docRef, { count: 1 });
            }
        } catch (error) {
            console.error("Error updating likes:", error);
            // Revert changes on failure
            setHasLiked(false);
            setLikes(prev => prev - 1);
            if (typeof window !== "undefined") {
                const likedEpisodes = JSON.parse(localStorage.getItem("liked_episodes") || "[]");
                localStorage.setItem("liked_episodes", JSON.stringify(likedEpisodes.filter((e: string) => e !== slug)));
            }
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={hasLiked || isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border ${hasLiked
                    ? "bg-primary/20 text-primary border-primary/40 cursor-default shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-white/[0.03] text-muted-foreground border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                }`}
            aria-label={hasLiked ? "Liked" : "Like this episode"}
        >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-primary text-primary drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" : ""}`} />
            <span className="text-sm font-semibold">
                {isLoading ? "..." : likes} {likes === 1 ? "Like" : "Likes"}
            </span>
        </button>
    );
}
