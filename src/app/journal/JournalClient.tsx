"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Post {
    id?: string;
    slug?: string;
    title: string;
    excerpt?: string;
    category?: string;
    date?: string;
    publishedAt?: string;
    readTime: string | number;
    image: string;
    featured?: boolean;
    isComingSoon?: boolean;
}

interface JournalClientProps {
    initialPosts: Post[];
    isGlobalComingSoon?: boolean;
}

export default function JournalClient({ initialPosts, isGlobalComingSoon }: JournalClientProps) {
    const mainRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const categories = ["All", ...Array.from(new Set(initialPosts.map(p => p.category).filter(Boolean)))];

    const filteredPosts = activeCategory === "All"
        ? initialPosts
        : initialPosts.filter(p => p.category === activeCategory);

    const featuredPost = initialPosts[0];
    const regularPosts = filteredPosts.filter(p =>
        (p.id || p.slug) !== (featuredPost?.id || featuredPost?.slug) || activeCategory !== "All"
    );

    const totalPages = Math.ceil(regularPosts.length / itemsPerPage);
    const currentPosts = regularPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".fade-in", {
                y: 30,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.15
            });

            gsap.utils.toArray<HTMLElement>(".post-card").forEach((card) => {
                gsap.from(card, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                    }
                });
            });
        }, mainRef);
        return () => ctx.revert();
    }, [activeCategory, initialPosts]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark">
            <Header />

            <main ref={mainRef} className="flex-grow bg-white dark:bg-background-dark">
                {isGlobalComingSoon ? (
                    <section className="px-8 lg:px-24 py-40 flex flex-col items-center justify-center min-h-[60vh] text-center border-b border-neutral-100 dark:border-white/5">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase mb-8">System Status / Offline</span>
                        <h2 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-primary dark:text-white mb-12">
                            JOURNAL <br /> COMING SOON.
                        </h2>
                        <p className="text-xl font-light text-primary/60 dark:text-white/60 max-w-lg leading-relaxed mb-12">
                            Our architecture journal is currently under maintenance. We are preparing to share our design insights and practice updates with you soon.
                        </p>
                        <Link 
                            href="/" 
                            className="bg-primary dark:bg-white text-white dark:text-primary px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-neutral-200 transition-all duration-300"
                        >
                            Return Home
                        </Link>
                    </section>
                ) : (
                    <>
                        {/* Hero Header */}
                        <section className="px-8 lg:px-24 pt-[104px] pb-12 lg:pt-32 lg:pb-16 border-b border-neutral-100 dark:border-white/5 fade-in">
                            <span className="block font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">
                                Reflections / Discourse / Process
                            </span>
                            <h1 className="text-5xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-primary dark:text-white mt-4">
                                JOURNAL.
                            </h1>
                            <p className="text-lg font-light text-primary/60 dark:text-white/60 max-w-xl mt-6 leading-relaxed">
                                Writing on architecture, design thinking, material culture, and the built environment in contemporary Nigeria.
                            </p>
                        </section>

                        {/* Category Filter */}
                        <div className="px-8 lg:px-24 py-4 border-b border-neutral-100 dark:border-white/5 fade-in">
                            <div className="flex flex-wrap gap-4 lg:gap-8" role="tablist" aria-label="Journal categories">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat!)}
                                        role="tab"
                                        aria-selected={activeCategory === cat}
                                        className={`font-mono text-[10px] tracking-[0.3em] uppercase py-2 border-b-2 transition-all duration-300 ${activeCategory === cat
                                            ? "border-primary dark:border-white text-primary dark:text-white"
                                            : "border-transparent text-primary/40 dark:text-white/40 hover:text-primary/70 dark:hover:text-white/70"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Featured Post */}
                        {activeCategory === "All" && featuredPost && (
                            <Link href={`/journal/${featuredPost.id || featuredPost.slug}`} className="block group">
                                <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-neutral-100 dark:border-white/5 fade-in">
                                    <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                                        {featuredPost.image ? (
                                                                                        <Image
                                                src={featuredPost.image}
                                                alt={featuredPost.title}
                                                fill
                                                priority
                                                loading="eager"
                                                className="object-cover group-hover:scale-105 transition-all duration-700"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-100 dark:bg-white/5" />
                                        )}

                                        {featuredPost.isComingSoon && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                                <span className="font-mono text-xs tracking-[0.4em] uppercase text-white border border-white/40 px-6 py-3 bg-black/40">
                                                    Coming Soon
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute top-6 left-6">
                                            <span className="bg-primary dark:bg-white text-white dark:text-primary font-mono text-[9px] tracking-[0.3em] uppercase px-4 py-2">
                                                Featured
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 lg:p-16 flex flex-col justify-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-[10px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase">
                                                {featuredPost.category || "Journal"}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-primary/20 dark:bg-white/20" />
                                            <span className="font-mono text-[10px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase">
                                                {formatDate(featuredPost.date || featuredPost.publishedAt)}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-white/80 transition-colors duration-300">
                                            {featuredPost.title}
                                        </h2>

                                        <p className="text-primary/70 dark:text-white/70 font-normal text-lg lg:text-xl leading-relaxed line-clamp-3">
                                            {featuredPost.excerpt || "Dive into our latest discourse on contemporary architectural practice."}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 text-primary/40 dark:text-white/40">
                                                <Clock size={12} />
                                                <span className="font-mono text-[10px] tracking-wider uppercase">{featuredPost.readTime} min read</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-primary dark:text-white group-hover:gap-3 transition-all duration-300">
                                                {featuredPost.isComingSoon ? 'Reserved' : 'Read Article'} <ArrowUpRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Link>
                        )}

                        {/* Posts Grid */}
                        <section className="px-8 lg:px-24 py-16 lg:py-24">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                                {currentPosts.map((post, i) => {
                                    const PostWrapper = post.isComingSoon ? 'div' : Link;
                                    const wrapperProps = post.isComingSoon 
                                        ? { className: "post-card flex flex-col cursor-default" } 
                                        : { href: `/journal/${post.id || post.slug}`, className: "post-card group flex flex-col" };

                                    return (
                                        <PostWrapper
                                            key={post.id || post.slug}
                                            {...wrapperProps as any}
                                        >
                                        {/* Image */}
                                        <div className="relative aspect-[3/2] overflow-hidden mb-6">
                                            {post.image ? (
                                                                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    loading={i < 2 ? "eager" : "lazy"}
                                                    className="object-cover group-hover:scale-105 transition-all duration-700"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-100 dark:bg-white/5" />
                                            )}

                                            {post.isComingSoon && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white border border-white/40 px-4 py-2 bg-black/40">
                                                        Coming Soon
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase">
                                                {post.category || "Journal"}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-primary/20 dark:bg-white/20" />
                                            <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase">
                                                {formatDate(post.date || post.publishedAt)}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl lg:text-3xl font-black tracking-tight leading-tight text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-white/80 transition-colors duration-300 mb-3">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-sm lg:text-base text-primary/70 dark:text-white/70 font-normal leading-relaxed flex-grow mb-6 line-clamp-3">
                                            {post.excerpt || "Exploring the intersection of tradition and modern design language."}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 text-primary/40 dark:text-white/40">
                                                <Clock size={11} />
                                                <span className="font-mono text-[9px] tracking-wider uppercase">{post.readTime} min read</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-primary dark:text-white group-hover:gap-3 transition-all duration-300">
                                                {post.isComingSoon ? 'Reserved' : 'Read'} <ArrowUpRight size={11} />
                                            </div>
                                        </div>
                                    </PostWrapper>
                                );
                            })}
                            </div>
                        </section>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <section className="px-8 lg:px-24 pb-24 flex justify-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                            className={`w-8 h-8 rounded-full font-mono text-xs transition-colors duration-300 cursor-pointer ${currentPage === i + 1
                                            ? "bg-primary text-white dark:bg-white dark:text-primary"
                                            : "bg-neutral-100 text-primary dark:bg-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </section>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
