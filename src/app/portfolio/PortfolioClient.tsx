"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

// Categories are now derived dynamically from the projects data

interface Project {
    id?: string;
    slug?: string;
    title: string;
    category?: string | string[];
    categories?: string[];
    location?: string;
    year: string;
    image: string;
    area?: string;
    duration?: string;
    client?: string;
    dimensions?: string;
    isComingSoon?: boolean;
}

interface PortfolioClientProps {
    projects: Project[];
}

export default function PortfolioClient({ projects }: PortfolioClientProps) {
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef(null);
    const itemsPerPage = 4;

    const categories = ["All", ...Array.from(new Set(projects.flatMap(p => {
        const cats = p.categories || (p.category ? (Array.isArray(p.category) ? p.category : [p.category]) : []);
        return cats;
    })))];

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => {
            const projectCats = p.categories || (p.category ? (Array.isArray(p.category) ? p.category : [p.category]) : []);
            return projectCats.includes(filter);
        });

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".portfolio-item", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                overwrite: "auto"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [filter]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow architectural-grid bg-white dark:bg-background-dark">
                {/* Header Section */}
                <section className="px-8 lg:px-24 pt-24 pb-0 lg:pt-24 lg:pb-24 flex flex-col items-center gap-12 border-b border-neutral-100 dark:border-white/5" aria-label="Portfolio header">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">Selected Projects — 2026</span>
                        <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-primary dark:text-white">
                            PROJECTS.
                        </h1>
                    </div>

                    {/* Filter UI */}
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8 border-y border-neutral-100 dark:border-white/5 py-4 w-full" role="tablist" aria-label="Project categories">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                role="tab"
                                aria-selected={filter === cat}
                                className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 relative ${filter === cat ? "text-primary dark:text-white" : "text-primary/40 dark:text-white/40 hover:text-primary dark:hover:text-white"
                                    }`}
                            >
                                {cat}
                                {filter === cat && (
                                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary dark:bg-white animate-pulse"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                <section ref={containerRef} className="px-8 lg:px-24 pt-6 pb-16 lg:pt-12 lg:pb-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24" aria-label="Project grid">
                    {currentProjects.map((project, index) => {
                        const ProjectWrapper = project.isComingSoon ? 'div' : Link;
                        const wrapperProps = project.isComingSoon 
                            ? { className: "portfolio-item flex flex-col gap-6 cursor-default" }
                            : { href: `/project/${project.id || project.slug}`, className: "portfolio-item group flex flex-col gap-6" };

                        return (
                            <ProjectWrapper
                                key={project.id || project.slug}
                                {...wrapperProps as any}
                            >
                            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-sm">
                                {/* Corner axis marks */}
                                <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-4 left-0 w-full h-[1px] bg-white"></div>
                                    <div className="absolute top-0 left-4 h-full w-[1px] bg-white"></div>
                                </div>

                                {project.image ? (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover brightness-100 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700 ease-out"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/5">
                                        <span className="font-mono text-[10px] tracking-widest text-primary/20 dark:text-white/20 uppercase">Image Pending</span>
                                    </div>
                                )}

                                {project.isComingSoon && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white border border-white/40 px-6 py-3 bg-black/40">
                                            Coming Soon
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/20"></div>

                                {!project.isComingSoon && (
                                    <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 tracking-widest flex items-center gap-2">
                                        VIEW SPECIFICATIONS <ArrowRight className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-6">
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-primary dark:text-white group-hover:translate-x-2 transition-transform duration-500">
                                    {project.title}
                                </h3>
                                <div className="grid grid-cols-3 border-t border-neutral-100 dark:border-white/5 pt-6 font-mono text-[9px] uppercase tracking-widest text-primary/40 dark:text-white/40">
                                    <div className="flex flex-col gap-2">
                                        <span>LOCATION</span>
                                        <span className="text-primary dark:text-white text-[10px] font-bold uppercase">{project.location || "N/A"}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span>YEAR</span>
                                        <span className="text-primary dark:text-white text-[10px] font-bold">{project.year || "2025"}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 text-right md:text-left">
                                        <span>TYPE</span>
                                        <span className="text-primary dark:text-white text-[10px] font-bold uppercase">
                                            {(() => {
                                                const projectCats = project.categories || (project.category ? (Array.isArray(project.category) ? project.category : [project.category]) : []);
                                                return projectCats.length > 0 ? projectCats[0] : "ARCHITECTURE";
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </ProjectWrapper>
                    );
                })}
                </section>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <section className="px-8 lg:px-24 pb-24 flex justify-center items-center gap-4 lg:gap-8">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors disabled:opacity-20 hover:text-primary dark:hover:text-white"
                        >
                            [ PREV ]
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center font-mono text-xs transition-colors duration-300 ${currentPage === i + 1
                                        ? "bg-primary text-white dark:bg-white dark:text-primary"
                                        : "bg-neutral-50 text-primary/40 dark:bg-neutral-900 dark:text-white/40 hover:bg-neutral-100 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors disabled:opacity-20 hover:text-primary dark:hover:text-white"
                        >
                            [ NEXT ]
                        </button>
                    </section>
                )}


            </main>

            <Footer />
        </div>
    );
}
