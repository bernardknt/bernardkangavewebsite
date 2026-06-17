"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const lastTracked = useRef<string>("");

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith("/admin")) return;

        // Avoid double-tracking the same page
        if (lastTracked.current === pathname) return;
        lastTracked.current = pathname;

        const title = document.title || pathname;
        trackPageView(pathname, title);
    }, [pathname]);

    return null; // This component renders nothing
}
