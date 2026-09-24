"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, Clock, ArrowUpRight } from "lucide-react";
import { PortableText } from "@portabletext/react";

interface Post {
    id?: string;
    slug?: string;
    title: string;
    excerpt?: string;
    content?: string[];
    category?: string;
    date?: string;
    publishedAt?: string;
    readTime: string | number;
    image: string;
    author: string;
    body?: any;
    isComingSoon?: boolean;
}

interface JournalPostClientProps {
    post: Post;
    relatedPosts: Post[];
    prevPost: Post | null;
    nextPost: Post | null;
}

export default function JournalPostClient({ post, relatedPosts, prevPost, nextPost }: JournalPostClientProps) {
    const mainRef = useRef(null);
    const [bodyExpanded, setBodyExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // On mobile the article body is clamped after the fifth block behind a
    // "Read More" toggle (same pattern as the project description).
    useEffect(() => {
        const media = window.matchMedia("(max-width: 1023px)");
        const update = () => {
            setIsMobile(media.matches);
            if (!media.matches) setBodyExpanded(true);
        };
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    const bodyBlocks = post.body ?? [];
    const contentParagraphs = post.content ?? [];
    const collapsed = isMobile && !bodyExpanded;
    const visibleBody = collapsed ? bodyBlocks.slice(0, 5) : bodyBlocks;
    const visibleContent = collapsed ? contentParagraphs.slice(0, 5) : contentParagraphs;
    const showReadMore = isMobile && (bodyBlocks.length > 5 || contentParagraphs.length > 5);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".fade-in", {
                y: 30,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.15
            });
            gsap.from(".content-para", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.1,
                delay: 0.4
            });
        }, mainRef);
        return () => ctx.revert();
    }, [post.id, post.slug]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        
        // YouTube
        const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
        
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
        if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        
        return url;
    };

    const ptComponents = {
        types: {
            youtube: ({ value }: any) => {
                const { url, html, videoType } = value;
                
                if (videoType === 'html' && html) {
                    return (
                        <div 
                            className="my-12 aspect-video w-full overflow-hidden rounded-sm bg-neutral-900 flex items-center justify-center video-embed-container"
                            dangerouslySetInnerHTML={{ 
                                __html: html.replace(/<iframe/g, '<iframe style="width:100%; height:100%; border:0;"') 
                            }}
                        />
                    );
                }
                
                if (url) {
                    const embedUrl = getEmbedUrl(url);
                    return (
                        <div className="my-12 aspect-video w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    );
                }

                return null;
            },
            image: ({ value }: any) => {
                // If you want custom image rendering in blog posts
                return (
                    <div className="my-12 relative aspect-video w-full overflow-hidden rounded-sm">
                        {/* You would typically use urlFor(value).url() here if using sanity image-url */}
                        {/* For now, we'll let the user handle image insertion or add a basic placeholder */}
                        <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                            <span className="font-mono text-[10px] opacity-20 uppercase">Blog Image Block</span>
                        </div>
                    </div>
                );
            }
        },
        block: {
            h2: ({ children }: any) => <h2 className="text-3xl lg:text-4xl font-black tracking-tight mt-16 mb-6 text-primary dark:text-white uppercase">{children}</h2>,
            h3: ({ children }: any) => <h3 className="text-2xl lg:text-3xl font-bold tracking-tight mt-12 mb-4 text-primary dark:text-white uppercase">{children}</h3>,
            blockquote: ({ children }: any) => (
                <blockquote className="border-l-4 border-primary/20 dark:border-white/20 pl-8 my-12 italic text-2xl lg:text-3xl font-medium text-primary/60 dark:text-white/60">
                    {children}
                </blockquote>
            ),
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark">
            <Header />

            <main ref={mainRef} className="flex-grow bg-white dark:bg-background-dark">

                {/* Hero Image */}
                <div className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden fade-in">
                    {post.image ? (
                        <>
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                            <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase">No Image Provided</span>
                        </div>
                    )}

                    {/* Back Button */}
                    <Link
                        href="/journal"
                        className="absolute top-24 lg:top-32 left-8 lg:left-24 flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300 group cursor-pointer z-10"
                        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0 text-white/60 group-hover:text-white" />
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase group-hover:underline underline-offset-4 decoration-white/20 group-hover:decoration-white transition-all">Back to Journal</span>
                    </Link>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-24">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="font-mono text-[10px] tracking-[0.3em] text-white/80 uppercase" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                                    {post.category || "Journal"}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/50" />
                                <span className="font-mono text-[10px] tracking-[0.3em] text-white/80 uppercase" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                                    {formatDate(post.date || post.publishedAt)}
                                </span>
                                {post.isComingSoon && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-white/50" />
                                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white border border-white/40 px-3 py-1">
                                            Coming Soon
                                        </span>
                                    </>
                                )}
                                <span className="w-1 h-1 rounded-full bg-white/50" />
                                <div className="flex items-center gap-1.5 text-white/80" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                                    <Clock size={11} />
                                    <span className="font-mono text-[10px] tracking-wider uppercase">{typeof post.readTime === "number" ? `${post.readTime} min read` : post.readTime}</span>
                                </div>
                            </div>
                            <h1
                                className="text-3xl lg:text-5xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white"
                                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                            >
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <article className="px-8 lg:px-24 py-16 lg:py-24">
                    <div className="max-w-3xl mx-auto">
                        {post.isComingSoon ? (
                            <div className="flex flex-col items-center justify-center min-h-[45vh] text-center">
                                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-primary dark:text-white mb-8">
                                    COMING SOON.
                                </h2>
                                <p className="text-lg lg:text-xl font-light text-primary/60 dark:text-white/60 max-w-lg leading-relaxed mb-10">
                                    This article is currently being prepared. Stay tuned — we're finalizing it and will publish soon.
                                </p>
                                <Link
                                    href="/journal"
                                    className="bg-primary dark:bg-white text-white dark:text-primary px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-neutral-200 transition-all duration-300"
                                >
                                    Back to Journal
                                </Link>
                            </div>
                        ) : (
                            <>
                        {/* Author & Share */}
                        <div className="flex items-center justify-between pb-8 mb-12 border-b border-neutral-100 dark:border-white/5 fade-in">
                            <div className="flex items-center gap-4 text-primary dark:text-white">
                                <div className="w-10 h-10 bg-primary dark:bg-white rounded-full flex items-center justify-center">
                                    <span className="text-white dark:text-primary text-xs font-bold">{post.author?.trim().charAt(0).toUpperCase() || 'V'}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{post.author?.trim() || "VARTEX Studio"}</p>
                                    <p className="font-mono text-[9px] tracking-wider opacity-40 uppercase">Vartex Architects</p>
                                </div>
                            </div>
                        </div>

                        {/* Lead paragraph / excerpt */}
                        {post.excerpt && (
                            <p className="text-xl lg:text-3xl font-bold leading-relaxed text-primary/90 dark:text-white/90 mb-12 content-para">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Body content (Portable Text for Sanity, Array for legacy) */}
                        <div className="prose prose-xl lg:prose-2xl dark:prose-invert max-w-none">
                            {post.body ? (
                                <div className="text-primary/90 dark:text-white/80 font-medium leading-relaxed journal-portable-text">
                                    <PortableText value={visibleBody} components={ptComponents} />
                                </div>
                            ) : (
                                visibleContent.map((paragraph, i) => (
                                    <p
                                        key={i}
                                        className="text-lg lg:text-2xl leading-[1.8] text-primary/90 dark:text-white/80 font-medium mb-10 content-para"
                                    >
                                        {paragraph}
                                    </p>
                                ))
                            )}
{showReadMore && (
                                <button
                                    type="button"
                                    onClick={() => setBodyExpanded((expanded) => !expanded)}
                                    className="mt-2 self-start font-mono text-[10px] font-bold tracking-[0.25em] text-primary dark:text-white underline underline-offset-4"
                                >
                                    {bodyExpanded ? "SHOW LESS" : "READ MORE"}
                                </button>
                            )}
                        </div>
                            </>
                        )}
                    </div>
                </article>

                {/* Post Navigation */}
                <div className="border-t border-neutral-100 dark:border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {prevPost ? (
                            <Link
                                href={`/journal/${prevPost.id || prevPost.slug}`}
                                className="group p-8 lg:p-16 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-300"
                            >
                                <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase mb-4 block">← Previous</span>
                                <h4 className="text-lg lg:text-xl font-bold tracking-tight text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-white/80 transition-colors duration-300">
                                    {prevPost.title}
                                </h4>
                            </Link>
                        ) : (
                            <div className="p-8 lg:p-16 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-white/5" />
                        )}

                        {nextPost ? (
                            <Link
                                href={`/journal/${nextPost.id || nextPost.slug}`}
                                className="group p-8 lg:p-16 text-right hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-300"
                            >
                                <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase mb-4 block">Next →</span>
                                <h4 className="text-lg lg:text-xl font-bold tracking-tight text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-white/80 transition-colors duration-300">
                                    {nextPost.title}
                                </h4>
                            </Link>
                        ) : (
                            <div className="p-8 lg:p-16" />
                        )}
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="px-8 lg:px-24 py-16 lg:py-24 border-t border-neutral-100 dark:border-white/5">
                        <h3 className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase mb-12">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                            {relatedPosts.slice(0, 3).map((related, index) => (
                                <Link
                                    key={related.id || related.slug}
                                    href={`/journal/${related.id || related.slug}`}
                                    className={`group flex-col ${index === 2 ? 'hidden lg:flex' : 'flex'}`}
                                >
                                    <div className="relative aspect-[3/2] overflow-hidden mb-8 rounded-sm">
                                        {related.image ? (
                                            <Image
                                                src={related.image}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-all duration-700"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-100 dark:bg-white/5" />
                                        )}
                                    </div>
                                    <span className="font-mono text-[9px] tracking-[0.3em] text-primary/40 dark:text-white/40 uppercase mb-3">
                                        {formatDate(related.date || related.publishedAt)}
                                    </span>
                                    <h4 className="text-xl font-bold tracking-tight text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-white/80 transition-colors duration-300 mb-3">
                                        {related.title}
                                    </h4>
                                    <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-primary dark:text-white group-hover:gap-3 transition-all duration-300 mt-auto pt-4">
                                        Read Article <ArrowUpRight size={11} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}
