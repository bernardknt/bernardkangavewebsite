"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MessageSquare, Send, User } from "lucide-react";

interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: any;
}

export default function CommentsSection({ blogId }: { blogId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!blogId) return;

        // Real-time listener for comments
        const q = query(
            collection(db, "blogs", blogId, "comments"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Comment[];
            setComments(msgs);
        });

        return () => unsubscribe();
    }, [blogId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "blogs", blogId, "comments"), {
                text: newComment,
                author: authorName || "Anonymous",
                createdAt: serverTimestamp(),
            });
            setNewComment("");
            // Keep author name for convenience
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Just now";
        return timestamp.toDate().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full max-w-[680px] mx-auto mt-16 pb-24">
            <h3 className="text-2xl font-bold font-serif text-gray-900 mb-8 flex items-center gap-2">
                Responses <span className="text-sm font-sans font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">{comments.length}</span>
            </h3>

            {/* Input Form */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-10 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Your name (optional)"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-200 focus:border-gray-800 outline-none px-0 py-2 text-sm text-gray-800 placeholder:text-gray-400 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full bg-white p-4 rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none min-h-[100px] text-gray-800 placeholder:text-gray-400 resize-y text-base"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-full font-medium text-sm hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? "Posting..." : "Respond"}
                            {!isSubmitting && <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="group border-b border-gray-100 pb-8 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-800 text-[15px] leading-relaxed pl-11 whitespace-pre-wrap font-serif">
                            {comment.text}
                        </p>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-10 text-gray-400 italic">
                        No responses yet. Be the first to share your thoughts.
                    </div>
                )}
            </div>
        </div>
    );
}
