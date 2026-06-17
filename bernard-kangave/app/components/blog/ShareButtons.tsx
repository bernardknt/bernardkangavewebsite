"use client";

import { Twitter, Linkedin, Link as LinkIcon, Facebook, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    // If url is not provided, we use window.location.href (client-side only)
    const getUrl = () => typeof window !== "undefined" ? window.location.href : "";

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: MessageCircle, // Closest to WhatsApp in standard Lucide set, or verify if specific icon exists. Usually separate lib or custom SVG. I'll use MessageCircle as placeholder or custom SVG if preferred. Actually simple text or FontAwesome is better but I stick to Lucide.
            color: "hover:bg-[#25D366] hover:text-white",
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + getUrl())}`, '_blank')
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "hover:bg-[#1DA1F2] hover:text-white",
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`, '_blank')
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            color: "hover:bg-[#0077b5] hover:text-white",
            action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`, '_blank')
        },
        {
            name: "Copy Link",
            icon: LinkIcon,
            color: "hover:bg-gray-800 hover:text-white",
            action: async () => {
                try {
                    await navigator.clipboard.writeText(getUrl());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            }
        }
    ];

    return (
        <div className="flex items-center gap-2 my-6">
            <span className="text-sm font-semibold text-gray-400 mr-2 uppercase tracking-wider">Share</span>
            {shareLinks.map((link) => (
                <button
                    key={link.name}
                    onClick={link.action}
                    title={`Share on ${link.name}`}
                    className={`p-2.5 rounded-full bg-gray-100 text-gray-600 transition-all duration-300 ${link.color}`}
                >
                    <link.icon className="w-4 h-4" />
                </button>
            ))}
            {copied && <span className="text-xs text-green-600 font-medium animate-in fade-in ml-2">Copied!</span>}
        </div>
    );
}
