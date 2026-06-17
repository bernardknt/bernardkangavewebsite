import { Globe2, TrendingUp } from "lucide-react";

export default function Impact() {
    return (
        <section className="py-20 bg-black text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-6 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Real Impact. <br />
                            <span className="text-primary">Global Reach.</span>
                        </h2>
                        <p className="text-lg text-white/70 max-w-md mx-auto md:mx-0">
                            Building systems that work across borders and industries. From local startups to international enterprises.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Stat 1 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                            <div className="mb-4 p-3 w-fit rounded-2xl bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                <TrendingUp size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-5xl font-bold tracking-tighter">212+</h3>
                                <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Businesses Impacted</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                            <div className="mb-4 p-3 w-fit rounded-2xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                                <Globe2 size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-5xl font-bold tracking-tighter">6</h3>
                                <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Countries Reached</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
