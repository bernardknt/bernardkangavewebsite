import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-border bg-background">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <div className="text-2xl font-bold tracking-tighter">BK.</div>
                    <p className="text-muted-foreground text-sm">
                        Empowering businesses to thrive through technology and streamlined systems.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Explore</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#about" className="hover:text-primary transition-colors">About</Link></li>
                        <li><Link href="#work" className="hover:text-primary transition-colors">Work</Link></li>
                        <li><Link href="#services" className="hover:text-primary transition-colors">Services</Link></li>
                        <li><Link href="/podcast" className="hover:text-primary transition-colors">Podcast</Link></li>
                        <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Ecosystem</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">Business Pilot</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">School of Systems</a></li>
                        <li><a href="https://www.youtube.com/@BernardKangave" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube Channel</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Connect</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="https://www.linkedin.com/in/bernard-kangave-a2b67370/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
                        <li><a href="https://x.com/bernardknt" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">X (Twitter)</a></li>
                        <li><a href="https://www.tiktok.com/@thebusinesspilot" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a></li>
                        <li><a href="https://open.spotify.com/show/2xsfOPS9JrhwFO8OeEAE2P?si=0lNwnNifTlyzavXTprvDGw" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Spotify</a></li>
                        <li><a href="mailto:bernardkangave@businesspilotapp.com" className="hover:text-primary transition-colors">Email Me</a></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Bernard Kangave. All rights reserved.</p>
            </div>
        </footer>
    );
}
