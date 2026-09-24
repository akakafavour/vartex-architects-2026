"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Spec {
    label: string;
    value: string;
}

interface Project {
    id?: string;
    slug?: string;
    title: string;
    client?: string;
    location?: string;
    year: string;
    area?: string;
    duration?: string;
    materiality?: string;
    sustainability?: string;
    isComingSoon?: boolean;
    categories?: string[];
    category?: string;
    description: string;
    images: string[];
}

interface ProjectClientProps {
    project: Project;
    prevProject: Project | null;
    nextProject: Project | null;
    relatedWorks: Project[];
}

export default function ProjectClient({ project, prevProject, nextProject, relatedWorks,
}: ProjectClientProps) {
    const mainRef = useRef(null);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    // Category-based related works logic
    const matchingCategory = project.categories?.[0] || project.category;

    const sortedRelatedWorks = [...relatedWorks].sort((a, b) => {
        const aCats = a.categories || (a.category ? [a.category] : []);
        const bCats = b.categories || (b.category ? [b.category] : []);

        const aMatches = aCats.includes(matchingCategory || "");
        const bMatches = bCats.includes(matchingCategory || "");

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
            });

            // Gallery items already inside the viewport on load must render
            // immediately — on tall screens a scroll-trigger here left the
            // visible image blank until the first scroll.
            gsap.utils.toArray<HTMLElement>(".image-scroll-item").forEach((item, index) => {
                const visibleOnLoad = item.getBoundingClientRect().top < window.innerHeight;
                gsap.from(item, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    ...(visibleOnLoad
                        ? { delay: 0.3 + index * 0.1 }
                        : { scrollTrigger: { trigger: item, start: "top 85%" } }),
                });
            });
        }, mainRef);
        return () => ctx.revert();
    }, [project.id, project.slug]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main ref={mainRef} className={`flex-grow ${project.isComingSoon ? 'bg-white dark:bg-background-dark pt-20' : 'architectural-grid bg-[#0a0a0a] text-white'}`}>
                {project.isComingSoon ? (
                    <section className="px-8 lg:px-24 py-40 flex flex-col items-center justify-center min-h-[70vh] text-center border-b border-neutral-100 dark:border-white/5">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase mb-8">Architecture / In Development</span>
                        <h2 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-primary dark:text-white mb-12">
                            PROJECT <br /> COMING SOON.
                        </h2>
                        <p className="text-xl font-light text-primary/60 dark:text-white/60 max-w-lg leading-relaxed mb-12">
                            We are currently finalizing the documentation and visualization for <strong>{project.title}</strong>. Please check back soon for the full project reveal.
                        </p>
                        <Link
                            href="/portfolio"
                            className="bg-primary dark:bg-white text-white dark:text-primary px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-neutral-200 transition-all duration-300"
                        >
                            Back to Portfolio
                        </Link>
                    </section>
                ) : (
                    <>
                        {/* Hero Section */}
                        <section className="relative flex flex-col px-8 lg:px-24 pt-32 pb-12 bg-[#0a0a0a] overflow-hidden">
                            {/* Background Detail */}
                            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[#0a0a0a]">
                                <div className="absolute inset-0"></div>
                            </div>

                            {/* Breadcrumb Navigation */}
                            <div className="relative z-10 mb-8 w-full">
                                <Link
                                    href="/portfolio"
                                    className="flex w-fit items-center gap-3 text-white/60 hover:text-white transition-all duration-300 group cursor-pointer relative z-30 py-2 pr-3 -ml-1"
                                >
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0 text-white/40 group-hover:text-white" />
                                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase hover:underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">PROJECTS // {project.title}</span>
                                </Link>
                            </div>

                            {/* Main Title Area */}
                            <div className="relative z-10 w-full mb-16 lg:pl-0">
                                <h1 className="pointer-events-none select-none text-6xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-black leading-[0.8] tracking-tighter uppercase text-white flex flex-wrap gap-x-6 md:gap-x-12">
                                    {project.title.split(' ').map((word, idx) => (
                                        <span
                                            key={idx}
                                            className={idx % 2 === 1 ? "lg:text-transparent lg:[-webkit-text-stroke:2px_white]" : ""}
                                        >
                                            {word}
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            {/* Metadata Section */}
                            <div className="relative z-10 w-full pt-12 border-t border-white/10">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-12">
                                    {[
                                        { label: "CLIENT", value: project.client || "NA" },
                                        { label: "LOCATION", value: project.location || "NA" },
                                        { label: "YEAR", value: project.year || "2025" },
                                        { label: "AREA", value: project.area || "NA" },
                                        { label: "STATUS", value: project.duration || "NA" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex flex-col gap-4">
                                            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">{label}</span>
                                            <span className={`font-black text-lg md:text-xl tracking-tight uppercase text-white ${label === 'CLIENT' ? 'break-words' : 'whitespace-nowrap'}`}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Content Section */}
                        <section className="px-8 lg:px-24 py-16 flex flex-col gap-12 lg:gap-24 relative z-10 bg-white dark:bg-[#0a0a0a]">
                            <div className="flex flex-col gap-4 lg:gap-8 w-full">
                                <h2 className="text-4xl font-black uppercase tracking-tight text-primary dark:text-white">Project Overview.</h2>
                                <div className={`text-xl lg:text-3xl font-light leading-relaxed text-primary/80 dark:text-white/80 italic ${descriptionExpanded ? "" : "line-clamp-4 lg:line-clamp-none"}`}>
                                    "{project.description}"
                                </div>
                                <button type="button" onClick={() => setDescriptionExpanded((expanded) => !expanded)} className="mt-0 self-start font-mono text-[10px] font-bold tracking-[0.25em] text-primary dark:text-white underline underline-offset-4 lg:hidden">
                                    {descriptionExpanded ? "SHOW LESS" : "READ MORE"}
                                </button>
                            </div>

                            {/* Full-Width Image Scroll */}
                            <div className="images-container flex flex-col gap-12 lg:gap-24 w-full">
                                {project.images?.filter(img => img && img.length > 0).slice(1).map((img, i) => (
                                    <div key={i} className="image-scroll-item w-full relative group">
                                        <div className="absolute top-8 left-8 z-10 font-mono text-[9px] uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
                                            {String(i + 1).padStart(2, '0')} / {String((project.images?.length || 1) - 1).padStart(2, '0')}
                                        </div>
                                        <div className="overflow-hidden rounded-sm bg-neutral-50 dark:bg-neutral-900/50">
                                            <Image
                                                src={img}
                                                alt={`${project.title} - Image ${i + 1}`}
                                                width={2400}
                                                height={1350}
                                                loading={i < 2 ? "eager" : "lazy"}
                                                priority={i === 0}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Specifications Section */}
                            <div className="w-full pt-20 pb-16 border-t border-neutral-100 dark:border-white/5 specs-container text-primary dark:text-white">
                                <div className="max-w-4xl">
                                    <div className="flex flex-col gap-4 mb-12">
                                        <h3 className="text-4xl font-black uppercase tracking-tighter">Specification.</h3>
                                    </div>

                                    <div className="flex flex-col gap-6 md:gap-8 w-full border-t border-neutral-200 dark:border-white/10 pt-8">
                                        {[
                                            { label: "Materiality", value: project.materiality || "NA" },
                                            { label: "Sustainability", value: project.sustainability || "NA" },
                                        ].map((spec, i) => (
                                            <div key={i} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-24 w-full pb-6 border-b border-neutral-200 dark:border-white/10">
                                                <span className="font-medium text-sm md:text-base opacity-60 w-32 shrink-0">{spec.label}</span>
                                                <span className="font-semibold text-lg md:text-xl tracking-tight leading-snug">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Project Navigation */}
                        <section className="bg-white dark:bg-background-dark border-t border-neutral-100 dark:border-white/5 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {prevProject ? (
                                    <Link
                                        href={`/project/${prevProject.id || prevProject.slug}`}
                                        className="group cursor-pointer p-8 lg:p-16 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-300"
                                    >
                                        <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase mb-4 block">← Previous Project</span>
                                        <h4 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-primary dark:text-white group-hover:text-primary/70 dark:group-hover:text-white/70 transition-colors">
                                            {prevProject.title}
                                        </h4>
                                    </Link>
                                ) : (
                                    <div className="p-8 lg:p-16 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-white/5" />
                                )}

                                {nextProject ? (
                                    <Link
                                        href={`/project/${nextProject.id || nextProject.slug}`}
                                        className="group cursor-pointer p-8 lg:p-16 text-right hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-300"
                                    >
                                        <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase mb-4 block">Next Project →</span>
                                        <h4 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-primary dark:text-white group-hover:text-primary/70 dark:group-hover:text-white/70 transition-colors">
                                            {nextProject.title}
                                        </h4>
                                    </Link>
                                ) : (
                                    <div className="p-8 lg:p-16 text-right border-neutral-100 dark:border-white/5" />
                                )}
                            </div>
                        </section>

                        {/* Related Works */}
                        <section id="related-architecture" className="px-8 lg:px-24 py-24 bg-white dark:bg-background-dark border-t border-neutral-100 dark:border-white/5 relative z-10">
                            <div className="mb-16">
                                <h3 className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">Related Projects</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                                {sortedRelatedWorks.slice(0, 3).map((work, index) => (
                                    <Link
                                        key={work.id || work.slug}
                                        href={`/project/${work.id || work.slug}`}
                                        className={`group flex-col ${index === 2 ? 'hidden lg:flex' : 'flex'}`}
                                    >
                                        <div className="relative aspect-[3/2] overflow-hidden mb-8 rounded-sm bg-neutral-900">
                                            {work.images?.[0] ? (
                                                <Image
                                                    src={work.images[0]}
                                                    alt={work.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-all duration-700"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase">
                                                {(() => {
                                                    const projectCats = work.categories || (work.category ? [work.category] : []);
                                                    return projectCats.length > 0 ? projectCats.join(' // ') : "NA";
                                                })()} // {work.year || "2025"}
                                            </span>
                                            <h4 className="text-xl font-black uppercase tracking-tight text-primary dark:text-white group-hover:text-primary/70 dark:group-hover:text-white/70 transition-colors">
                                                {work.title}
                                            </h4>
                                            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-primary dark:text-white group-hover:gap-3 transition-all mt-4">
                                                View Project <ArrowUpRight size={11} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
