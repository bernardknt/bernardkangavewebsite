"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppCommunityCTA() {
    return (
        <div className="my-16 relative overflow-hidden rounded-2xl bg-[#000d14] p-8 md:p-12 text-center md:text-left">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#25D366] opacity-10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500 opacity-10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-serif">
                        Join our Community of Leaders
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        Connect with other business architects and visionaries. Get exclusive insights, updates, and direct access to our growing network on WhatsApp.
                    </p>
                </div>

                <a
                    href="https://chat.whatsapp.com/YOUR_INVITE_LINK_HERE" // Generic placeholder, user needs to update
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-900/20 hover:shadow-green-500/30 hover:-translate-y-1"
                >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Join WhatsApp Group</span>
                </a>
            </div>
        </div>
    );
}
