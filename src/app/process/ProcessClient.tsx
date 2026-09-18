"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const STEPS = [
    {
        id: "01",
        title: "Conception & Strategy.",
        subtitle: "UNDERSTANDING YOUR PROJECT",
        description: "Every project starts with a conversation. We work closely with you to define your goals, your site, and how the building will be used.",
        details: [
            "Site Analysis & Contextual Mapping",
            "Conceptual Sketching",
            "Feasibility Studies",
            "Project Brief Development"
        ],
        image: "/images/process/architect-studio-workspace.jpg"
    },
    {
        id: "02",
        title: "Design Development.",
        subtitle: "SHAPING THE DESIGN",
        description: "In this phase, we turn sketches into detailed drawings and 3D models, refining the shape, lighting, and structure of the building.",
        details: [
            "3D Volumetric Modeling",
            "Material Research & Sourcing",
            "Floor Plan Optimization",
            "Structural Coordination"
        ],
        image: "/images/process/digital-skyscraper-modeling.jpg"
    },
    {
        id: "03",
        title: "Construction Drawings.",
        subtitle: "DETAILED PLANNING",
        description: "Accuracy matters most here. We create detailed drawings and documents that guide the construction team through every part of the build.",
        details: [
            "Detailed Construction Drawings",
            "Engineering Integration",
            "Specification Writing",
            "Permit Documentation"
        ],
        image: "/images/process/architectural-precision-drafting.jpg"
    },
    {
        id: "04",
        title: "Construction & Oversight.",
        subtitle: "OVERSEEING CONSTRUCTION",
        description: "In the final phase, we manage the site and check quality closely, making sure the finished building matches the design at every stage.",
        details: [
            "Construction Administration",
            "On-site Quality Control",
            "Finish & Fixture Selection",
            "Final Project Delivery"
        ],
        image: "/images/process/construction-site-execution.jpg"
    }
];

export default function ProcessPage() {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".fade-in", {
                y: 30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
            });

            gsap.from(".line-grow", {
                scaleY: 0,
                duration: 1.5,
                transformOrigin: "top",
                ease: "power2.out",
                stagger: 0.3
            });

            // Step numbers light up on scroll
            gsap.utils.toArray<HTMLElement>(".step-container").forEach((container) => {
                const num = container.querySelector(".step-number");
                const img = container.querySelector(".process-image");
                const text = container.querySelector(".text-content");

                gsap.fromTo(num,
                    { opacity: 0.1 },
                    {
                        opacity: 1,
                        duration: 1,
                        scrollTrigger: {
                            trigger: container,
                            start: "top 80%",
                            end: "top 40%",
                            scrub: true,
                        }
                    }
                );

                gsap.from(img, {
                    clipPath: "inset(100% 0 0 0)",
                    duration: 1.5,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 70%",
                    }
                });

                gsap.from(text, {
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 70%",
                    }
                });
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark">
            <Header />

            <main ref={mainRef} className="flex-grow pt-24 pb-16 lg:pt-48 lg:pb-64 px-8 lg:px-24 flex flex-col gap-16 lg:gap-32 overflow-hidden">

                {/* Intro Section */}
                <div className="flex flex-col gap-12 max-w-5xl fade-in">
                    <div className="flex flex-col gap-6">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">02 / OUR METHODOLOGY</span>
                        <h1 className="text-6xl lg:text-[8rem] font-black tracking-tighter leading-[0.85] text-primary dark:text-white uppercase">
                            Sketch <br /> To Stone.
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                        <p className="text-xl lg:text-3xl font-light text-primary/60 dark:text-white/60 leading-snug italic">
                            A structured approach to architecture, combining creative design with technical precision.
                        </p>
                        <div className="flex flex-col gap-4 font-mono text-[10px] tracking-[0.2em] text-primary dark:text-white uppercase items-start lg:items-end">
                            <span>TOTAL PHASES: 04</span>
                            <span>ATTENTION TO DETAIL: 100%</span>
                        </div>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="flex flex-col gap-16 lg:gap-64 mt-8 lg:mt-24">
                    {STEPS.map((step, i) => (
                        <section key={step.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-24 items-start relative fade-in step-container">

                            {/* Step Numbering (Floating) */}
                            <div className="lg:col-span-1 flex flex-row lg:flex-col items-center gap-4 lg:gap-12 lg:h-full step-number-container">
                                <span className="text-3xl lg:text-7xl font-black text-primary dark:text-white opacity-10 tracking-tighter step-number transition-opacity duration-500">{step.id}</span>
                                <div className="hidden lg:block w-[1px] flex-grow bg-neutral-100 dark:bg-white/5 line-grow"></div>
                            </div>

                            {/* Text Content */}
                            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-12 pt-0 lg:pt-4 text-content">
                                <div className="flex flex-col gap-4">
                                    <span className="font-mono text-[9px] tracking-[0.5em] text-primary/40 dark:text-white/40 uppercase">{step.subtitle}</span>
                                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-primary dark:text-white uppercase">{step.title}</h2>
                                </div>
                                <p className="text-lg lg:text-xl font-light leading-relaxed text-primary/60 dark:text-white/60 max-w-lg italic">
                                    {step.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 border-t border-neutral-100 dark:border-white/5 pt-6 lg:pt-12">
                                    {step.details.map((detail, idx) => (
                                        <div key={idx} className="flex gap-4 items-start group">
                                            <span className="font-mono text-[8px] mt-1.5 text-primary/30 dark:text-white/30">0{idx + 1}</span>
                                            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-white group-hover:translate-x-1 transition-transform">{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Imagery */}
                            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-sm border border-neutral-100 dark:border-white/5 shadow-2xl process-image">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover hover:scale-110 transition-transform duration-[2000ms] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Closing Statement */}
                <div className="mt-12 lg:mt-32 flex flex-col items-center text-center gap-6 lg:gap-12 py-8 lg:py-24 border-t border-neutral-100 dark:border-white/5 fade-in">
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] tracking-[0.5em] text-primary/30 dark:text-white/30 uppercase">THE RESULT</span>
                        <h3 className="text-4xl lg:text-7xl font-black tracking-tighter text-primary dark:text-white uppercase">Architectural Excellence.</h3>
                    </div>
                    <Link href="/contact" className="bg-primary dark:bg-white text-white dark:text-primary px-16 py-6 rounded-sm font-bold uppercase tracking-[0.4em] text-xs hover:bg-black dark:hover:bg-neutral-200 transition-all shadow-xl">
                        START A PROJECT
                    </Link>
                </div>

            </main>

            <Footer />
        </div>
    );
}
