import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Visitor ID (anonymous, persistent) ─────────────────
const VISITOR_ID_KEY = "bk_visitor_id";
const SESSION_KEY = "bk_session_id";
const SESSION_START_KEY = "bk_session_start";

function getOrCreateVisitorId(): string {
    if (typeof window === "undefined") return "server";
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
        id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
}

function getOrCreateSessionId(): string {
    if (typeof window === "undefined") return "server";
    // Session expires after 30 mins of inactivity
    const sessionStart = sessionStorage.getItem(SESSION_START_KEY);
    const now = Date.now();
    if (sessionStart && now - parseInt(sessionStart) < 30 * 60 * 1000) {
        return sessionStorage.getItem(SESSION_KEY) || createNewSession();
    }
    return createNewSession();
}

function createNewSession(): string {
    const id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
    return id;
}

// ─── Device / Browser / OS Parsing ──────────────────────
interface DeviceInfo {
    device: "mobile" | "tablet" | "desktop";
    browser: string;
    os: string;
    screenWidth: number;
    screenHeight: number;
    language: string;
}

function parseDevice(): DeviceInfo {
    if (typeof navigator === "undefined" || typeof window === "undefined") {
        return { device: "desktop", browser: "unknown", os: "unknown", screenWidth: 0, screenHeight: 0, language: "en" };
    }
    const ua = navigator.userAgent;

    let device: DeviceInfo["device"] = "desktop";
    if (/Mobi|Android/i.test(ua)) device = "mobile";
    else if (/iPad|Tablet/i.test(ua)) device = "tablet";

    let browser = "unknown";
    if (/CriOS/i.test(ua)) browser = "Chrome (iOS)";
    else if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Edg/i.test(ua)) browser = "Edge";
    else if (/OPR/i.test(ua)) browser = "Opera";

    let os = "unknown";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac OS/i.test(ua)) os = "macOS";
    else if (/iPhone|iPad/i.test(ua)) os = "iOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/Linux/i.test(ua)) os = "Linux";

    return {
        device,
        browser,
        os,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language || "en",
    };
}

// ─── Source / Referrer Parsing ───────────────────────────
interface SourceInfo {
    referrer: string;
    source: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
}

function parseSource(): SourceInfo {
    if (typeof window === "undefined") {
        return { referrer: "", source: "direct", utmSource: "", utmMedium: "", utmCampaign: "" };
    }
    const referrer = document.referrer || "";
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || "";
    const utmMedium = params.get("utm_medium") || "";
    const utmCampaign = params.get("utm_campaign") || "";

    let source = "direct";
    if (utmSource) {
        source = utmSource;
    } else if (referrer) {
        try {
            const hostname = new URL(referrer).hostname.toLowerCase();
            if (hostname.includes("whatsapp") || hostname.includes("wa.me")) source = "whatsapp";
            else if (hostname.includes("instagram")) source = "instagram";
            else if (hostname.includes("facebook") || hostname.includes("l.facebook") || hostname.includes("lm.facebook")) source = "facebook";
            else if (hostname.includes("twitter") || hostname.includes("t.co") || hostname.includes("x.com")) source = "twitter/x";
            else if (hostname.includes("linkedin")) source = "linkedin";
            else if (hostname.includes("google")) source = "google";
            else if (hostname.includes("tiktok")) source = "tiktok";
            else if (hostname.includes("youtube")) source = "youtube";
            else if (hostname.includes("bing")) source = "bing";
            else source = hostname;
        } catch {
            source = "unknown";
        }
    }
    return { referrer, source, utmSource, utmMedium, utmCampaign };
}

// ─── Country detection via free API ─────────────────────
async function detectCountry(): Promise<{ country: string; city: string; timezone: string }> {
    try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return {
            country: data.country_name || "Unknown",
            city: data.city || "Unknown",
            timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    } catch {
        return {
            country: "Unknown",
            city: "Unknown",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    }
}

// ─── Tracking Functions ─────────────────────────────────

export async function trackPageView(path: string, title: string): Promise<void> {
    if (typeof window === "undefined") return;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const deviceInfo = parseDevice();
    const sourceInfo = parseSource();
    const locationData = await detectCountry();

    const now = new Date();
    const dateKey = now.toISOString().split("T")[0]; // "2026-03-05"
    const hourKey = now.getHours();

    const pageViewData = {
        visitorId,
        sessionId,
        path,
        title,
        timestamp: serverTimestamp(),
        dateKey,
        hourKey,
        ...deviceInfo,
        ...sourceInfo,
        ...locationData,
    };

    try {
        // 1. Write individual page view
        await addDoc(collection(db, "site_analytics"), pageViewData);

        // 2. Update daily aggregate
        const dailyRef = doc(db, "site_daily_stats", dateKey);
        const dailySnap = await getDoc(dailyRef);

        if (dailySnap.exists()) {
            await updateDoc(dailyRef, {
                pageViews: increment(1),
                updatedAt: serverTimestamp(),
            });
        } else {
            await setDoc(dailyRef, {
                date: dateKey,
                pageViews: 1,
                uniqueVisitors: 0, // computed separately
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        // 3. Update visitor record (for unique tracking)
        const visitorRef = doc(db, "site_visitors", visitorId);
        const visitorSnap = await getDoc(visitorRef);

        if (visitorSnap.exists()) {
            await updateDoc(visitorRef, {
                lastSeen: serverTimestamp(),
                totalPageViews: increment(1),
                lastPage: path,
                lastSessionId: sessionId,
            });
        } else {
            await setDoc(visitorRef, {
                visitorId,
                firstSeen: serverTimestamp(),
                lastSeen: serverTimestamp(),
                totalPageViews: 1,
                lastPage: path,
                lastSessionId: sessionId,
                ...deviceInfo,
                ...sourceInfo,
                ...locationData,
            });

            // Increment unique visitors for today
            if (dailySnap.exists()) {
                await updateDoc(dailyRef, {
                    uniqueVisitors: increment(1),
                });
            } else {
                await updateDoc(dailyRef, {
                    uniqueVisitors: 1,
                });
            }
        }
    } catch (error) {
        console.error("Analytics tracking error:", error);
    }
}
