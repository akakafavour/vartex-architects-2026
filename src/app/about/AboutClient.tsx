"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AWARDS = [
    { year: "2026", title: "AD 30/30VISION DESIGN COMPETITION", project: "AD Consulting LTD", status: "Participation" },
    { year: "2025", title: "AD 30/30VISION DESIGN COMPETITION", project: "AD Consulting LTD", status: "2nd Prize" },
];

export default function About({ founderImage }: { founderImage?: string }) {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".fade-in", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            });

            // Awards scroll animation (mobile)
            if (window.matchMedia("(max-width: 1024px)").matches) {
                gsap.utils.toArray(".award-row").forEach((row: any) => {
                    gsap.fromTo(row,
                        { opacity: 0.3 },
                        {
                            opacity: 1,
                            scrollTrigger: {
                                trigger: row,
                                start: "top 80%",
                                end: "top 40%",
                                scrub: true,
                            }
                        }
                    );
                });
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main ref={mainRef} className="flex-grow flex flex-col items-center relative architectural-grid bg-white dark:bg-background-dark overflow-hidden">
                {/* Decorative Axis Lines */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                    <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-primary dark:bg-white"></div>
                    <div className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-primary dark:bg-white"></div>
                </div>

                <div className="w-full max-w-[1400px] px-8 lg:px-24 py-24 lg:py-32 z-10 flex flex-col gap-32">

                    {/* Founder Profile Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start fade-in">
                        {/* Left Column: Portrait */}
                        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-8 relative group">
                            {/* Right Column: Hero Image */}
                            <div className="w-full relative aspect-[3/4] bg-neutral-100 dark:bg-white/5 overflow-hidden">
                                <Image
                                    src={founderImage || "/about-hero.webp"}
                                    alt="VARTEX Studio Philosophy"
                                    fill
                                    priority
                                    className="object-cover transition-all duration-700"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />

                                {/* Overlay Texture */}
                                <div className="absolute inset-0 bg-neutral-900/10 dark:bg-white/5 pointer-events-none"></div>

                                {/* Technical Corner Overlay / Solid Black */}
                                <div className="absolute bottom-4 left-4 px-5 py-3 bg-black border border-white/10 font-mono text-[9px] tracking-[0.4em] uppercase z-10 transition-colors">
                                    <span className="relative z-10 text-white font-semibold">MICHAEL MBAH — DIRECTOR</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 border-t border-neutral-100 dark:border-white/5 pt-6 font-mono text-[10px] tracking-widest text-primary/40 dark:text-white/40 uppercase">
                                <div className="flex justify-between">
                                    <span>B.ARCH / UNEC</span>
                                    <span>M.ARCH / UNILAG</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>REGISTRATION</span>
                                    <span className="text-primary dark:text-white">IN VIEW</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Bio */}
                        <div className="lg:col-span-12 xl:col-span-7 xl:col-start-6 flex flex-col gap-12">
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-primary dark:text-white uppercase">
                                Crafting clarity <br /> from complexity.
                            </h1>
                            <div className="flex flex-col gap-8 text-xl lg:text-2xl font-light leading-snug text-primary/80 dark:text-white/80 max-w-2xl italic">
                                <p>
                                    Our practice is founded on the belief that architecture is a dialogue between cultural context and environmental awareness. We strip away the noise to reveal the essential structure, finding beauty in geometric precision, material authenticity and structural integrity.
                                </p>
                            </div>
                            <div className="flex flex-col gap-6 text-base font-light leading-relaxed text-primary/60 dark:text-white/60 max-w-xl">
                                <p>
                                    VARTEX was founded in 2025 to bring thoughtful, well-engineered architecture to commercial and residential projects across Nigeria. Our mission is to design spaces that balance function, budget, and beauty.
                                </p>
                                <p>
                                    Our team collaborates with engineers, landscape architects, and other specialists to deliver buildings that are structurally sound and beautifully designed.
                                </p>
                            </div>
                            <div className="pt-12">
                                <Link href="/contact" className="bg-primary dark:bg-white text-white dark:text-primary px-12 py-5 rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black dark:hover:bg-neutral-200 transition-all shadow-lg active:scale-95">
                                    START A PROJECT
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* AWARDS & RECOGNITION */}
                    <section className="flex flex-col gap-12 border-t border-neutral-100 dark:border-white/5 pt-24 fade-in">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">01 / ACCOLADES</span>
                                <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-primary dark:text-white">Recognition.</h2>
                            </div>
                            <span className="font-mono text-[9px] tracking-widest text-primary/20 dark:text-white/20 uppercase hidden sm:block">CURATED SELECTION / 2020/2025</span>
                        </div>

                        <div className="flex flex-col">
                            {AWARDS.map((award, i) => (
                                <div key={i} className="award-row group grid grid-cols-1 md:grid-cols-12 py-8 border-b border-neutral-50 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors items-center px-4">
                                    <span className="md:col-span-1 font-mono text-[10px] text-primary/40 dark:text-white/40">{award.year}</span>
                                    <div className="md:col-span-6 flex flex-col">
                                        <h4 className="text-lg font-bold text-primary dark:text-white group-hover:translate-x-2 transition-transform">{award.title}</h4>
                                        <span className="font-mono text-[9px] tracking-widest text-primary/40 dark:text-white/40 uppercase">{award.project}</span>
                                    </div>
                                    <div className="md:col-span-5 flex justify-end">
                                        <div className="border border-neutral-200 dark:border-white/10 px-4 py-2 rounded-full font-mono text-[9px] uppercase tracking-widest group-hover:border-primary dark:group-hover:border-white transition-colors">
                                            {award.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
