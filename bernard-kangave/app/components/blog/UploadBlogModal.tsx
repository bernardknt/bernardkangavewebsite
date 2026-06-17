"use client";

import { useState } from "react";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function UploadBlogModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        author: "Bernard Kangave",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "blogs"), {
                ...formData,
                createdAt: serverTimestamp(),
            });
            setIsOpen(false);
            setFormData({ title: "", excerpt: "", content: "", imageUrl: "", author: "Bernard Kangave" });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to create blog post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors opacity-50 hover:opacity-100"
            >
                <Upload className="w-3 h-3" />
                <span>Add Post</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-2xl bg-muted/95 border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-background/50">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
                        New Insight
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form */}
                <div className="overflow-y-auto p-6 md:p-8">
                    <form id="blog-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Title
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-lg font-medium"
                                placeholder="The Art of System Building..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Cover Image URL
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/50 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="https://..."
                                />
                                <ImagePlus className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground/50" />
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 mt-1.5 ml-1">
                                Enter a direct URL to an image.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Summary / Excerpt
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
                                placeholder="A brief teaser of the article..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Content
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 resize-none leading-relaxed"
                                placeholder="Start writing..."
                            />
                            <div className="text-[10px] text-muted-foreground/60 mt-2 ml-1 space-y-1">
                                <p>Formatting Guide:</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li><strong>## Heading</strong> for section titles</li>
                                    <li><strong>**bold**</strong> and <em>*italic*</em> text</li>
                                    <li><strong>&gt; Quote</strong> for blockquotes</li>
                                    <li><strong>- Item</strong> for lists</li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 bg-background/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        form="blog-form"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/10 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
}
