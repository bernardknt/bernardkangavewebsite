"use client";

import { useState, useEffect, useMemo } from "react";
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    where,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    BarChart3,
    Users,
    Eye,
    Globe,
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    TrendingUp,
    Activity,
    Radio,
    Heart,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    Headphones,
    FileText,
    MousePointer,
    MapPin,
    Calendar,
    RefreshCw,
    Lock,
    LogOut,
    ChevronDown,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────
interface PageView {
    id: string;
    visitorId: string;
    sessionId: string;
    path: string;
    title: string;
    timestamp: Timestamp;
    dateKey: string;
    hourKey: number;
    device: string;
    browser: string;
    os: string;
    source: string;
    referrer: string;
    country: string;
    city: string;
    timezone: string;
    language: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
}

interface DailyStat {
    date: string;
    pageViews: number;
    uniqueVisitors: number;
}

interface PodcastSession {
    id: string;
    episodeSlug: string;
    episodeTitle: string;
    listenerId: string;
    totalListenTimeSec: number;
    completionPercent: number;
    completed: boolean;
    device: string;
    browser: string;
    source: string;
    country?: string;
    updatedAt: Timestamp;
}

interface EpisodeStat {
    slug: string;
    episodeTitle: string;
    totalPlays: number;
    totalListenTimeSec: number;
    completions: number;
}

// ─── Admin Dashboard Component ──────────────────────────
const ADMIN_PASSWORD = "@Businesspilot123";

type TimeRange = "today" | "7d" | "30d" | "all";

export default function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>("7d");
    const [activeTab, setActiveTab] = useState<"overview" | "pages" | "podcast" | "visitors" | "geo">("overview");

    // Data state
    const [pageViews, setPageViews] = useState<PageView[]>([]);
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [podcastSessions, setPodcastSessions] = useState<PodcastSession[]>([]);
    const [episodeStats, setEpisodeStats] = useState<EpisodeStat[]>([]);
    const [blogCount, setBlogCount] = useState(0);

    // ─── Auth ─────────────────────────────────────────────
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = sessionStorage.getItem("bk_admin_auth");
            if (saved === "true") setAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
            sessionStorage.setItem("bk_admin_auth", "true");
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    };

    const handleLogout = () => {
        setAuthenticated(false);
        sessionStorage.removeItem("bk_admin_auth");
    };

    // ─── Data Fetching ────────────────────────────────────
    const fetchData = async () => {
        setRefreshing(true);
        try {
            // Calculate date boundary
            const now = new Date();
            let startDate: Date;
            switch (timeRange) {
                case "today":
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case "7d":
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case "30d":
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(2020, 0, 1);
            }

            // 1. Fetch page views
            const pvQuery = query(
                collection(db, "site_analytics"),
                where("dateKey", ">=", startDate.toISOString().split("T")[0]),
                orderBy("dateKey", "desc"),
                limit(5000)
            );
            const pvSnap = await getDocs(pvQuery);
            const pvData = pvSnap.docs.map(d => ({ id: d.id, ...d.data() } as PageView));
            setPageViews(pvData);

            // 2. Fetch daily stats
            const dsQuery = query(
                collection(db, "site_daily_stats"),
                where("date", ">=", startDate.toISOString().split("T")[0]),
                orderBy("date", "asc"),
                limit(365)
            );
            const dsSnap = await getDocs(dsQuery);
            setDailyStats(dsSnap.docs.map(d => d.data() as DailyStat));

            // 3. Fetch podcast analytics sessions
            const paQuery = query(
                collection(db, "podcast_analytics"),
                orderBy("updatedAt", "desc"),
                limit(2000)
            );
            const paSnap = await getDocs(paQuery);
            setPodcastSessions(paSnap.docs.map(d => ({ id: d.id, ...d.data() } as PodcastSession)));

            // 4. Fetch episode aggregate stats
            const esSnap = await getDocs(collection(db, "podcast_episode_stats"));
            setEpisodeStats(esSnap.docs.map(d => d.data() as EpisodeStat));

            // 5. Fetch blog count
            const blogSnap = await getDocs(collection(db, "blogs"));
            setBlogCount(blogSnap.size);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (authenticated) {
            setLoading(true);
            fetchData();
        }
    }, [authenticated, timeRange]);

    // ─── Computed Metrics ─────────────────────────────────
    const metrics = useMemo(() => {
        const totalPageViews = pageViews.length;
        const uniqueVisitors = new Set(pageViews.map(p => p.visitorId)).size;
        const uniqueSessions = new Set(pageViews.map(p => p.sessionId)).size;
        const avgPagesPerSession = uniqueSessions > 0 ? (totalPageViews / uniqueSessions).toFixed(1) : "0";

        // Country breakdown
        const countryMap: Record<string, number> = {};
        pageViews.forEach(p => {
            const c = p.country || "Unknown";
            countryMap[c] = (countryMap[c] || 0) + 1;
        });
        const topCountries = Object.entries(countryMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, views]) => ({ name, views, pct: totalPageViews > 0 ? ((views / totalPageViews) * 100).toFixed(1) : "0" }));

        // City breakdown
        const cityMap: Record<string, number> = {};
        pageViews.forEach(p => {
            const c = p.city || "Unknown";
            cityMap[c] = (cityMap[c] || 0) + 1;
        });
        const topCities = Object.entries(cityMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, views]) => ({ name, views, pct: totalPageViews > 0 ? ((views / totalPageViews) * 100).toFixed(1) : "0" }));

        // Device breakdown
        const deviceMap: Record<string, number> = {};
        pageViews.forEach(p => {
            deviceMap[p.device] = (deviceMap[p.device] || 0) + 1;
        });

        // Browser breakdown
        const browserMap: Record<string, number> = {};
        pageViews.forEach(p => {
            browserMap[p.browser] = (browserMap[p.browser] || 0) + 1;
        });
        const topBrowsers = Object.entries(browserMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        // OS breakdown
        const osMap: Record<string, number> = {};
        pageViews.forEach(p => {
            osMap[p.os] = (osMap[p.os] || 0) + 1;
        });
        const topOS = Object.entries(osMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        // Source / referrer breakdown
        const sourceMap: Record<string, number> = {};
        pageViews.forEach(p => {
            sourceMap[p.source] = (sourceMap[p.source] || 0) + 1;
        });
        const topSources = Object.entries(sourceMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, views]) => ({ name, views, pct: totalPageViews > 0 ? ((views / totalPageViews) * 100).toFixed(1) : "0" }));

        // Top pages
        const pageMap: Record<string, number> = {};
        pageViews.forEach(p => {
            pageMap[p.path] = (pageMap[p.path] || 0) + 1;
        });
        const topPages = Object.entries(pageMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, views]) => ({ path, views, pct: totalPageViews > 0 ? ((views / totalPageViews) * 100).toFixed(1) : "0" }));

        // Hourly distribution
        const hourMap: Record<number, number> = {};
        for (let i = 0; i < 24; i++) hourMap[i] = 0;
        pageViews.forEach(p => {
            if (p.hourKey !== undefined) hourMap[p.hourKey]++;
        });
        const maxHourViews = Math.max(...Object.values(hourMap), 1);

        // Podcast metrics
        const totalPodcastPlays = episodeStats.reduce((sum, e) => sum + (e.totalPlays || 0), 0);
        const totalListenTime = episodeStats.reduce((sum, e) => sum + (e.totalListenTimeSec || 0), 0);
        const totalCompletions = episodeStats.reduce((sum, e) => sum + (e.completions || 0), 0);

        // Podcast likes (count from podcast_likes collection is read separately — for now use episode stats count)
        const uniqueListeners = new Set(podcastSessions.map(s => s.listenerId)).size;

        return {
            totalPageViews,
            uniqueVisitors,
            uniqueSessions,
            avgPagesPerSession,
            topCountries,
            topCities,
            deviceMap,
            topBrowsers,
            topOS,
            topSources,
            topPages,
            hourMap,
            maxHourViews,
            totalPodcastPlays,
            totalListenTime,
            totalCompletions,
            uniqueListeners,
        };
    }, [pageViews, episodeStats, podcastSessions]);

    // ─── Login Screen ─────────────────────────────────────
    if (!authenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Enter password to access analytics</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="relative mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                                placeholder="Password"
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${passwordError ? "border-red-500/50" : "border-white/10"} text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all`}
                                autoFocus
                            />
                        </div>
                        {passwordError && (
                            <p className="text-red-400 text-sm mb-4 text-center">Incorrect password</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ─── Helpers ───────────────────────────────────────────
    const formatNumber = (n: number) => {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return n.toString();
    };

    const formatDuration = (sec: number) => {
        if (sec < 60) return `${Math.round(sec)}s`;
        if (sec < 3600) return `${Math.floor(sec / 60)}m ${Math.floor(sec % 60)}s`;
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const deviceIcon = (device: string) => {
        switch (device) {
            case "mobile": return <Smartphone className="w-4 h-4" />;
            case "tablet": return <Tablet className="w-4 h-4" />;
            default: return <Monitor className="w-4 h-4" />;
        }
    };

    const timeRangeLabel: Record<TimeRange, string> = {
        today: "Today",
        "7d": "Last 7 Days",
        "30d": "Last 30 Days",
        all: "All Time",
    };

    const tabs = [
        { id: "overview" as const, label: "Overview", icon: BarChart3 },
        { id: "pages" as const, label: "Pages", icon: FileText },
        { id: "podcast" as const, label: "Podcast", icon: Radio },
        { id: "visitors" as const, label: "Visitors", icon: Users },
        { id: "geo" as const, label: "Geography", icon: Globe },
    ];

    // ─── Mini bar chart component ─────────────────────────
    const MiniBar = ({ data, maxVal }: { data: DailyStat[]; maxVal: number }) => (
        <div className="flex items-end gap-[2px] h-16">
            {data.slice(-14).map((d, i) => (
                <div
                    key={i}
                    className="flex-1 bg-primary/60 rounded-t-sm hover:bg-primary transition-colors cursor-default min-w-[3px]"
                    style={{ height: `${Math.max(4, (d.pageViews / Math.max(maxVal, 1)) * 100)}%` }}
                    title={`${d.date}: ${d.pageViews} views`}
                />
            ))}
        </div>
    );

    // ─── Stat Card ────────────────────────────────────────
    const StatCard = ({ icon: Icon, label, value, subValue, trend }: {
        icon: React.ElementType; label: string; value: string | number; subValue?: string; trend?: "up" | "down" | "neutral";
    }) => (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-colors group">
            <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}>
                        {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : trend === "down" ? <ArrowDownRight className="w-3 h-3" /> : null}
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
            {subValue && <div className="text-xs text-primary/70 mt-0.5">{subValue}</div>}
        </div>
    );

    // ─── Progress Bar Row ─────────────────────────────────
    const ProgressRow = ({ label, value, total, icon }: { label: string; value: number; total: number; icon?: React.ReactNode }) => {
        const pct = total > 0 ? (value / total) * 100 : 0;
        return (
            <div className="flex items-center gap-3 group">
                {icon && <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white truncate">{label}</span>
                        <span className="text-xs text-muted-foreground ml-2 tabular-nums">{value} <span className="text-white/20">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(1, pct)}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    // ─── Loading State ────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // ─── Main Dashboard ───────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white">Bernard Kangave</h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Analytics Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Time Range Selector */}
                        <div className="relative">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                                className="appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 pr-8 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:border-primary/50"
                            >
                                {Object.entries(timeRangeLabel).map(([key, label]) => (
                                    <option key={key} value={key} className="bg-[#1a1a1a] text-white">{label}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Refresh */}
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-colors group"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tab Navigation */}
                <nav className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-primary/15 text-primary border border-primary/20"
                                : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* ═══════════════════════════════════════════ */}
                {/* OVERVIEW TAB                               */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <StatCard icon={Eye} label="Page Views" value={formatNumber(metrics.totalPageViews)} trend="up" />
                            <StatCard icon={Users} label="Unique Visitors" value={formatNumber(metrics.uniqueVisitors)} trend="up" />
                            <StatCard icon={MousePointer} label="Sessions" value={formatNumber(metrics.uniqueSessions)} />
                            <StatCard icon={Activity} label="Avg Pages/Session" value={metrics.avgPagesPerSession} />
                            <StatCard icon={Headphones} label="Podcast Plays" value={formatNumber(metrics.totalPodcastPlays)} trend="up" />
                            <StatCard icon={FileText} label="Blog Posts" value={blogCount} />
                        </div>

                        {/* Daily Traffic Chart */}
                        {dailyStats.length > 0 && (
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        Daily Traffic
                                    </h2>
                                    <span className="text-xs text-muted-foreground">{dailyStats.length} days</span>
                                </div>
                                <div className="flex items-end gap-[3px] h-40">
                                    {dailyStats.map((d, i) => {
                                        const maxViews = Math.max(...dailyStats.map(s => s.pageViews), 1);
                                        const height = (d.pageViews / maxViews) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                                <div className="absolute -top-8 bg-white/10 backdrop-blur-lg rounded-md px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                    {d.date}: {d.pageViews} views
                                                </div>
                                                <div
                                                    className="w-full bg-primary/50 rounded-t-sm hover:bg-primary transition-all cursor-default"
                                                    style={{ height: `${Math.max(2, height)}%` }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                                    <span>{dailyStats[0]?.date}</span>
                                    <span>{dailyStats[dailyStats.length - 1]?.date}</span>
                                </div>
                            </div>
                        )}

                        {/* Two-Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Pages */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Top Pages
                                </h2>
                                <div className="space-y-4">
                                    {metrics.topPages.map((pg, i) => (
                                        <ProgressRow key={i} label={pg.path} value={pg.views} total={metrics.totalPageViews} />
                                    ))}
                                    {metrics.topPages.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Traffic Sources */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Traffic Sources
                                </h2>
                                <div className="space-y-4">
                                    {metrics.topSources.map((src, i) => (
                                        <ProgressRow key={i} label={src.name} value={src.views} total={metrics.totalPageViews} />
                                    ))}
                                    {metrics.topSources.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hourly Distribution */}
                        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                            <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Traffic by Hour of Day
                            </h2>
                            <div className="flex items-end gap-1 h-28">
                                {Array.from({ length: 24 }, (_, i) => {
                                    const val = metrics.hourMap[i] || 0;
                                    const height = (val / metrics.maxHourViews) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                            <div className="absolute -top-6 bg-white/10 backdrop-blur-lg rounded-md px-1.5 py-0.5 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {i}:00 — {val}
                                            </div>
                                            <div
                                                className="w-full bg-primary/40 rounded-t-sm hover:bg-primary transition-all cursor-default"
                                                style={{ height: `${Math.max(2, height)}%` }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                                <span>12 AM</span>
                                <span>6 AM</span>
                                <span>12 PM</span>
                                <span>6 PM</span>
                                <span>11 PM</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* PAGES TAB                                  */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === "pages" && (
                    <div className="space-y-6">
                        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
                            <div className="p-6 border-b border-white/[0.06]">
                                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    All Pages Performance
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] text-muted-foreground text-xs uppercase tracking-wider">
                                            <th className="text-left px-6 py-3 font-medium">Page</th>
                                            <th className="text-right px-6 py-3 font-medium">Views</th>
                                            <th className="text-right px-6 py-3 font-medium">% Share</th>
                                            <th className="text-right px-6 py-3 font-medium">Unique Visitors</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {metrics.topPages.map((pg, i) => {
                                            const uniqueForPage = new Set(pageViews.filter(p => p.path === pg.path).map(p => p.visitorId)).size;
                                            return (
                                                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-3 text-white font-medium">{pg.path}</td>
                                                    <td className="px-6 py-3 text-right tabular-nums">{pg.views}</td>
                                                    <td className="px-6 py-3 text-right tabular-nums text-muted-foreground">{pg.pct}%</td>
                                                    <td className="px-6 py-3 text-right tabular-nums">{uniqueForPage}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {metrics.topPages.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">No page view data yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* PODCAST TAB                                */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === "podcast" && (
                    <div className="space-y-6">
                        {/* Podcast KPIs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon={Headphones} label="Total Plays" value={formatNumber(metrics.totalPodcastPlays)} trend="up" />
                            <StatCard icon={Users} label="Unique Listeners" value={formatNumber(metrics.uniqueListeners)} />
                            <StatCard icon={Clock} label="Total Listen Time" value={formatDuration(metrics.totalListenTime)} />
                            <StatCard icon={Activity} label="Completions" value={formatNumber(metrics.totalCompletions)} />
                        </div>

                        {/* Episodes Table */}
                        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
                            <div className="p-6 border-b border-white/[0.06]">
                                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Radio className="w-4 h-4 text-primary" />
                                    Episode Performance
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] text-muted-foreground text-xs uppercase tracking-wider">
                                            <th className="text-left px-6 py-3 font-medium">Episode</th>
                                            <th className="text-right px-6 py-3 font-medium">Plays</th>
                                            <th className="text-right px-6 py-3 font-medium">Listen Time</th>
                                            <th className="text-right px-6 py-3 font-medium">Completions</th>
                                            <th className="text-right px-6 py-3 font-medium">Comp. Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {episodeStats
                                            .sort((a, b) => (b.totalPlays || 0) - (a.totalPlays || 0))
                                            .map((ep, i) => {
                                                const compRate = ep.totalPlays > 0 ? ((ep.completions / ep.totalPlays) * 100).toFixed(1) : "0";
                                                return (
                                                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-3">
                                                            <div className="text-white font-medium truncate max-w-[300px]">{ep.episodeTitle}</div>
                                                            <div className="text-xs text-muted-foreground">{ep.slug}</div>
                                                        </td>
                                                        <td className="px-6 py-3 text-right tabular-nums">{ep.totalPlays}</td>
                                                        <td className="px-6 py-3 text-right tabular-nums text-muted-foreground">{formatDuration(ep.totalListenTimeSec)}</td>
                                                        <td className="px-6 py-3 text-right tabular-nums">{ep.completions}</td>
                                                        <td className="px-6 py-3 text-right">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${parseFloat(compRate) >= 50 ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                                                {compRate}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                                {episodeStats.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">No podcast analytics data yet</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Podcast Sessions */}
                        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
                            <div className="p-6 border-b border-white/[0.06]">
                                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    Recent Listening Sessions
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] text-muted-foreground text-xs uppercase tracking-wider">
                                            <th className="text-left px-6 py-3 font-medium">Episode</th>
                                            <th className="text-left px-6 py-3 font-medium">Listener</th>
                                            <th className="text-right px-6 py-3 font-medium">Duration</th>
                                            <th className="text-right px-6 py-3 font-medium">Progress</th>
                                            <th className="text-left px-6 py-3 font-medium">Device</th>
                                            <th className="text-left px-6 py-3 font-medium">Source</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {podcastSessions.slice(0, 20).map((session, i) => (
                                            <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-3 text-white truncate max-w-[200px]">{session.episodeTitle}</td>
                                                <td className="px-6 py-3 text-muted-foreground text-xs font-mono truncate max-w-[120px]">{session.listenerId}</td>
                                                <td className="px-6 py-3 text-right tabular-nums">{formatDuration(session.totalListenTimeSec)}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, session.completionPercent)}%` }} />
                                                        </div>
                                                        <span className="text-xs tabular-nums text-muted-foreground">{session.completionPercent?.toFixed(0)}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        {deviceIcon(session.device)} {session.browser}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground capitalize">{session.source}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {podcastSessions.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">No listening sessions yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* VISITORS TAB                               */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === "visitors" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Device Distribution */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-primary" />
                                    Devices
                                </h2>
                                <div className="space-y-4">
                                    {Object.entries(metrics.deviceMap)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([device, count]) => (
                                            <ProgressRow
                                                key={device}
                                                label={device}
                                                value={count}
                                                total={metrics.totalPageViews}
                                                icon={deviceIcon(device)}
                                            />
                                        ))}
                                    {Object.keys(metrics.deviceMap).length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No data</p>
                                    )}
                                </div>
                            </div>

                            {/* Browser Distribution */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Browsers
                                </h2>
                                <div className="space-y-4">
                                    {metrics.topBrowsers.map(([browser, count]) => (
                                        <ProgressRow key={browser} label={browser} value={count} total={metrics.totalPageViews} />
                                    ))}
                                    {metrics.topBrowsers.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No data</p>
                                    )}
                                </div>
                            </div>

                            {/* OS Distribution */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-primary" />
                                    Operating Systems
                                </h2>
                                <div className="space-y-4">
                                    {metrics.topOS.map(([os, count]) => (
                                        <ProgressRow key={os} label={os} value={count} total={metrics.totalPageViews} />
                                    ))}
                                    {metrics.topOS.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No data</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Visitors Stream */}
                        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
                            <div className="p-6 border-b border-white/[0.06]">
                                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    Recent Visitors
                                    <span className="ml-auto text-xs text-muted-foreground">Latest {Math.min(30, pageViews.length)} page views</span>
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] text-muted-foreground text-xs uppercase tracking-wider">
                                            <th className="text-left px-6 py-3 font-medium">Page</th>
                                            <th className="text-left px-6 py-3 font-medium">Visitor</th>
                                            <th className="text-left px-6 py-3 font-medium">Device</th>
                                            <th className="text-left px-6 py-3 font-medium">Location</th>
                                            <th className="text-left px-6 py-3 font-medium">Source</th>
                                            <th className="text-left px-6 py-3 font-medium">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageViews.slice(0, 30).map((pv, i) => (
                                            <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-3 text-white font-medium truncate max-w-[200px]">{pv.path}</td>
                                                <td className="px-6 py-3 text-xs font-mono text-muted-foreground truncate max-w-[100px]">{pv.visitorId}</td>
                                                <td className="px-6 py-3">
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        {deviceIcon(pv.device)} {pv.browser} / {pv.os}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground">{pv.city}, {pv.country}</td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground capitalize">{pv.source}</td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground tabular-nums">
                                                    {pv.timestamp?.toDate ? pv.timestamp.toDate().toLocaleString() : pv.dateKey}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {pageViews.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">No visitor data yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* GEOGRAPHY TAB                              */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === "geo" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Countries */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Top Countries
                                </h2>
                                <div className="space-y-4">
                                    {metrics.topCountries.map((c, i) => (
                                        <ProgressRow key={i} label={c.name} value={c.views} total={metrics.totalPageViews} icon={<MapPin className="w-3.5 h-3.5" />} />
                                    ))}
                                    {metrics.topCountries.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No geographic data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Cities */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Top Cities
                                </h2>
                                <div className="space-y-4">
                                    {metrics.topCities.map((c, i) => (
                                        <ProgressRow key={i} label={c.name} value={c.views} total={metrics.totalPageViews} />
                                    ))}
                                    {metrics.topCities.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No city data yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Language / Timezone breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Languages
                                </h2>
                                <div className="space-y-4">
                                    {(() => {
                                        const langMap: Record<string, number> = {};
                                        pageViews.forEach(p => {
                                            const lang = p.language || "unknown";
                                            langMap[lang] = (langMap[lang] || 0) + 1;
                                        });
                                        return Object.entries(langMap)
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 8)
                                            .map(([lang, count]) => (
                                                <ProgressRow key={lang} label={lang} value={count} total={metrics.totalPageViews} />
                                            ));
                                    })()}
                                </div>
                            </div>

                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                                <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Timezones
                                </h2>
                                <div className="space-y-4">
                                    {(() => {
                                        const tzMap: Record<string, number> = {};
                                        pageViews.forEach(p => {
                                            const tz = p.timezone || "unknown";
                                            tzMap[tz] = (tzMap[tz] || 0) + 1;
                                        });
                                        return Object.entries(tzMap)
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 8)
                                            .map(([tz, count]) => (
                                                <ProgressRow key={tz} label={tz} value={count} total={metrics.totalPageViews} />
                                            ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-6 mt-12">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Bernard Kangave Analytics Dashboard</span>
                    <span>Data refreshed • {new Date().toLocaleTimeString()}</span>
                </div>
            </footer>
        </div>
    );
}
