"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add scroll listener for glass effect intensity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    const navLinks = [
        { href: "/#about", label: "About" },
        { href: "/#projects", label: "Projects" },
        { href: "/blogs", label: "Blog" }, // Renamed from "Blog" for premium feel
        { href: "/podcast", label: "Podcast" },
        { href: "/#contact", label: "Contact" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative h-10 w-auto z-50 group" onClick={closeMenu}>
                    <Image
                        src="/sign.png"
                        alt="Bernard Kangave"
                        height={40}
                        width={180}
                        className="object-contain h-full w-auto transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center">
                    <a
                        href="mailto:bernardkangave@businesspilotapp.com"
                        className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span>Let&apos;s Talk</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 -mr-2 text-white z-50 relative hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-white transform transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 relative">
                    <nav className="flex flex-col items-center gap-6 w-full max-w-sm">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={closeMenu}
                                className="text-3xl font-serif text-gray-900 hover:text-gray-500 transition-colors"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="w-full max-w-xs h-px bg-gray-100 my-8" />

                    <div className="flex flex-col items-center gap-6 w-full">
                        <a
                            href="mailto:bernardkangave@businesspilotapp.com"
                            onClick={closeMenu}
                            className="w-full max-w-xs flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all shadow-xl active:scale-95"
                        >
                            <span>Let&apos;s Build Systems</span>
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <div className="text-sm text-gray-400">
                            bernardkangave@businesspilotapp.com
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
