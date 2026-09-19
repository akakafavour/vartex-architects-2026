"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const navItems = [
        { name: "PROJECTS", href: "/portfolio" },
        { name: "SERVICES", href: "/services" },
        { name: "PROCESS", href: "/process" },
        { name: "STUDIO", href: "/about" },
        { name: "JOURNAL", href: "/journal" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[900] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-neutral-100 dark:border-white/5 h-20 flex items-center px-4 lg:px-24">
            <nav className="flex justify-between items-center w-full">
                {/* Logo */}
                <Link href="/" className="shrink-0 group flex items-center justify-center p-2" aria-label="VARTEX Architects Home">
                    <div className="relative flex items-center justify-center">
                        {/* Light mode: black logo */}
                        <Image
                            src="/brand-logo-light-transparent.png"
                            alt="VARTEX Logo"
                            width={200}
                            height={200}
                            className="w-auto h-16 object-contain dark:hidden"
                            priority
                        />
                        {/* Dark mode: white logo */}
                        <Image
                            src="/brand-logo-dark-transparent.png"
                            alt="VARTEX Logo"
                            width={200}
                            height={200}
                            className="w-auto h-16 object-contain hidden dark:block"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-12">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "font-mono text-[10px] font-bold tracking-[0.3em] transition-all hover:opacity-100 uppercase",
                                pathname === item.href
                                    ? "text-primary dark:text-white opacity-100"
                                    : "text-primary dark:text-white opacity-60"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <Link
                        href="/contact"
                        aria-label="Start a project consultation"
                        className="bg-primary dark:bg-white text-white dark:text-primary px-6 py-3 rounded-sm font-bold uppercase tracking-[0.2em] text-xs hover:bg-black dark:hover:bg-neutral-200 transition-all ml-4 whitespace-nowrap"
                    >
                        START A PROJECT
                    </Link>
                </div>

                {/* Mobile Menu Icon */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-primary dark:text-white z-[1000] p-2 relative"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X className="w-6 h-6 text-primary dark:text-white" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-white dark:bg-black z-[950] transition-all duration-300 ease-in-out lg:hidden flex flex-col justify-center items-center text-center px-8 h-dvh",
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
            >
                <div className="flex flex-col gap-8 mb-12">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300",
                                pathname === item.href
                                    ? "text-primary dark:text-white"
                                    : "text-primary/40 dark:text-white/40 hover:text-primary dark:hover:text-white"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="w-full max-w-sm flex flex-col gap-8">
                    <Link
                        href="/contact"
                        className="bg-primary dark:bg-white text-white dark:text-primary w-full py-5 md:py-6 text-center font-bold uppercase tracking-[0.25em] text-sm rounded-sm hover:opacity-80 transition-colors"
                    >
                        START A PROJECT
                    </Link>

                    <div className="pt-12 border-t border-neutral-200 dark:border-white/10 flex flex-col gap-6">
                        <nav className="flex justify-center gap-12 font-mono text-[9px] text-primary/40 dark:text-white/40 uppercase tracking-[0.4em]">
                            <a href="https://www.instagram.com/vartex_architects" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">INSTAGRAM</a>
                            <a href="https://www.linkedin.com/company/vartexarchitects/" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">LINKEDIN</a>
                        </nav>
                        <span className="font-mono text-[9px] tracking-[0.5em] text-primary/20 dark:text-white/20 uppercase">© 2026 VARTEX ARCHITECTS</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
