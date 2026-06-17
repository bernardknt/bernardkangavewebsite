import {
    doc,
    collection,
    addDoc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Anonymous Listener ID ──────────────────────────────────
const LISTENER_ID_KEY = "podcast_listener_id";

function getOrCreateListenerId(): string {
    if (typeof window === "undefined") return "server";
    let id = localStorage.getItem(LISTENER_ID_KEY);
    if (!id) {
        id = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(LISTENER_ID_KEY, id);
    }
    return id;
}

// ─── Device / Browser / OS Parsing ──────────────────────────
interface DeviceInfo {
    device: "mobile" | "tablet" | "desktop";
    browser: string;
    os: string;
}

function parseDevice(): DeviceInfo {
    if (typeof navigator === "undefined") {
        return { device: "desktop", browser: "unknown", os: "unknown" };
    }

    const ua = navigator.userAgent;

    // Device
    let device: DeviceInfo["device"] = "desktop";
    if (/Mobi|Android/i.test(ua)) device = "mobile";
    else if (/iPad|Tablet/i.test(ua)) device = "tablet";

    // Browser
    let browser = "unknown";
    if (/CriOS/i.test(ua)) browser = "Chrome (iOS)";
    else if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Edg/i.test(ua)) browser = "Edge";
    else if (/OPR/i.test(ua)) browser = "Opera";

    // OS
    let os = "unknown";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac OS/i.test(ua)) os = "macOS";
    else if (/iPhone|iPad/i.test(ua)) os = "iOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/Linux/i.test(ua)) os = "Linux";

    return { device, browser, os };
}

// ─── Referral / UTM Parsing ─────────────────────────────────
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

    // Derive a human-readable source name
    let source = "direct";
    if (utmSource) {
        source = utmSource;
    } else if (referrer) {
        try {
            const hostname = new URL(referrer).hostname.toLowerCase();
            if (hostname.includes("whatsapp") || hostname.includes("wa.me")) source = "whatsapp";
            else if (hostname.includes("instagram") || hostname.includes("l.instagram")) source = "instagram";
            else if (hostname.includes("facebook") || hostname.includes("l.facebook") || hostname.includes("lm.facebook")) source = "facebook";
            else if (hostname.includes("twitter") || hostname.includes("t.co") || hostname.includes("x.com")) source = "twitter/x";
            else if (hostname.includes("linkedin")) source = "linkedin";
            else if (hostname.includes("google")) source = "google";
            else if (hostname.includes("tiktok")) source = "tiktok";
            else if (hostname.includes("youtube")) source = "youtube";
            else source = hostname;
        } catch {
            source = "unknown";
        }
    }

    return { referrer, source, utmSource, utmMedium, utmCampaign };
}

// ─── Analytics Tracker Class ────────────────────────────────
export interface EpisodeMeta {
    slug: string;
    title: string;
}

export class PodcastAnalyticsTracker {
    private audio: HTMLAudioElement;
    private meta: EpisodeMeta;
    private listenerId: string;
    private deviceInfo: DeviceInfo;
    private sourceInfo: SourceInfo;

    // Session metrics
    private sessionStart: string;
    private totalListenTimeSec = 0;
    private maxPositionSec = 0;
    private playCount = 0;
    private pauseCount = 0;
    private seekCount = 0;
    private completed = false;
    private lastTickTime = 0; // audio.currentTime at the last timeupdate
    private isPlaying = false;
    private flushed = false;

    // Timer for periodic flush
    private flushInterval: ReturnType<typeof setInterval> | null = null;

    // Bound handlers (for cleanup)
    private handlePlay: () => void;
    private handlePause: () => void;
    private handleSeeked: () => void;
    private handleTimeUpdate: () => void;
    private handleEnded: () => void;
    private handleBeforeUnload: () => void;

    constructor(audio: HTMLAudioElement, meta: EpisodeMeta) {
        this.audio = audio;
        this.meta = meta;
        this.listenerId = getOrCreateListenerId();
        this.deviceInfo = parseDevice();
        this.sourceInfo = parseSource();
        this.sessionStart = new Date().toISOString();

        // Bind event handlers
        this.handlePlay = this.onPlay.bind(this);
        this.handlePause = this.onPause.bind(this);
        this.handleSeeked = this.onSeeked.bind(this);
        this.handleTimeUpdate = this.onTimeUpdate.bind(this);
        this.handleEnded = this.onEnded.bind(this);
        this.handleBeforeUnload = this.onBeforeUnload.bind(this);

        // Attach listeners
        audio.addEventListener("play", this.handlePlay);
        audio.addEventListener("pause", this.handlePause);
        audio.addEventListener("seeked", this.handleSeeked);
        audio.addEventListener("timeupdate", this.handleTimeUpdate);
        audio.addEventListener("ended", this.handleEnded);
        window.addEventListener("beforeunload", this.handleBeforeUnload);

        // Periodic flush every 30 seconds while playing
        this.flushInterval = setInterval(() => {
            if (this.isPlaying) {
                this.flushSession();
            }
        }, 30_000);
    }

    private onPlay(): void {
        this.playCount++;
        this.isPlaying = true;
        this.lastTickTime = this.audio.currentTime;
    }

    private onPause(): void {
        if (this.isPlaying) {
            this.pauseCount++;
            this.isPlaying = false;
            this.flushSession();
        }
    }

    private onSeeked(): void {
        this.seekCount++;
        this.lastTickTime = this.audio.currentTime;
    }

    private onTimeUpdate(): void {
        const ct = this.audio.currentTime;
        // Accumulate listen time only if the user is actually listening
        // (small forward jumps from natural playback, not big seek jumps)
        const delta = ct - this.lastTickTime;
        if (delta > 0 && delta < 2) {
            this.totalListenTimeSec += delta;
        }
        this.lastTickTime = ct;
        if (ct > this.maxPositionSec) {
            this.maxPositionSec = ct;
        }
    }

    private onEnded(): void {
        this.completed = true;
        this.isPlaying = false;
        this.flushSession();
    }

    private onBeforeUnload(): void {
        this.flushSession();
    }

    // ─── Flush Session Data to Firestore ────────────────────
    private async flushSession(): Promise<void> {
        // Only flush if there was any actual play activity
        if (this.playCount === 0) return;

        const durationSec = this.audio.duration || 0;
        const completionPercent = durationSec > 0
            ? Math.min(100, Math.round((this.maxPositionSec / durationSec) * 1000) / 10)
            : 0;

        const sessionData = {
            episodeSlug: this.meta.slug,
            episodeTitle: this.meta.title,
            listenerId: this.listenerId,
            sessionStart: this.sessionStart,
            sessionEnd: new Date().toISOString(),
            totalListenTimeSec: Math.round(this.totalListenTimeSec),
            maxPositionSec: Math.round(this.maxPositionSec),
            durationSec: Math.round(durationSec),
            completionPercent,
            completed: this.completed,
            playCount: this.playCount,
            pauseCount: this.pauseCount,
            seekCount: this.seekCount,
            ...this.deviceInfo,
            ...this.sourceInfo,
            updatedAt: serverTimestamp(),
        };

        try {
            // Write/update the individual session document
            await addDoc(collection(db, "podcast_analytics"), sessionData);

            // Update aggregate episode stats (only once per session end)
            if (!this.flushed) {
                this.flushed = true;
                await this.updateAggregateStats(completionPercent);
            }
        } catch (error) {
            console.error("Error flushing podcast analytics:", error);
        }
    }

    private async updateAggregateStats(completionPercent: number): Promise<void> {
        try {
            const statsRef = doc(db, "podcast_episode_stats", this.meta.slug);
            const statsSnap = await getDoc(statsRef);

            if (statsSnap.exists()) {
                await updateDoc(statsRef, {
                    totalPlays: increment(1),
                    totalListenTimeSec: increment(Math.round(this.totalListenTimeSec)),
                    completions: this.completed ? increment(1) : increment(0),
                    lastPlayedAt: new Date().toISOString(),
                });
            } else {
                await setDoc(statsRef, {
                    slug: this.meta.slug,
                    episodeTitle: this.meta.title,
                    totalPlays: 1,
                    totalListenTimeSec: Math.round(this.totalListenTimeSec),
                    completions: this.completed ? 1 : 0,
                    lastPlayedAt: new Date().toISOString(),
                    createdAt: serverTimestamp(),
                });
            }
        } catch (error) {
            console.error("Error updating aggregate stats:", error);
        }
    }

    // ─── Cleanup ────────────────────────────────────────────
    destroy(): void {
        this.flushSession();

        this.audio.removeEventListener("play", this.handlePlay);
        this.audio.removeEventListener("pause", this.handlePause);
        this.audio.removeEventListener("seeked", this.handleSeeked);
        this.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
        this.audio.removeEventListener("ended", this.handleEnded);
        window.removeEventListener("beforeunload", this.handleBeforeUnload);

        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
    }
}
