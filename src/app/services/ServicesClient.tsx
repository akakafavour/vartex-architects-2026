"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home as HomeIcon, Sofa, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, X, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requestGuideAction, GuideState, submitQuizAction, QuizState } from "./actions";

gsap.registerPlugin(ScrollTrigger);

type Tier = {
    name: string;
    sub: string;
    price: string;
    desc: string;
    phases: { label: string; items: string[] }[];
    recommended?: boolean;
};

type ServiceData = {
    id: "architecture" | "interior";
    index: string;
    label: string;
    headline: string[];
    hero: string;
    image: string;
    imageAlt: string;
    approach: string;
    how: [string, string, string][];
    tiers: Tier[];
    disclaimer: string;
    buildSection: boolean;
    closing: string;
};

const ARCHITECTURE: ServiceData = {
    id: "architecture",
    index: "01",
    label: "ARCHITECTURAL DESIGN",
    headline: ["ARCHITECTURAL", "DESIGN."],
    hero: "We start every project by listening, to your goals and to the site itself, including its orientation and constraints. The design grows out of that understanding, rather than being decided in advance.",
    image: "/images/services/architectural-design.jpeg",
    imageAlt: "Architects developing a spatial concept in the studio",
    approach: "Every building we design responds to three things: the land it sits on, the light and ventilation it receives, and the people who live there.",
    how: [
        ["01", "CONCEPTION & STRATEGY", "We work closely with you to define your goals, your site, and how the building will be used."],
        ["02", "DESIGN DEVELOPMENT", "We turn sketches into detailed drawings and 3D models, refining the shape, lighting, and function of the building."],
        ["03", "CONSTRUCTION DRAWINGS", "We prepare detailed construction drawings covering every part of the building clearly, leaving no room for guesswork on site."],
        ["04", "BUILD & OVERSIGHT", "We remain present through construction, ensuring the finished building stays true to the original design."],
    ],
    tiers: [
        {
            name: "Basic", sub: "The Essential", price: "Starting from $600",
            desc: "For clients who arrive with a resolved vision and require precise technical documentation to move into construction without delay.",
            phases: [
                { label: "01 / MOBILIZATION & CONCEPT", items: ["Initial consultation and briefing", "Remote site analysis", "Space planning and moodboard"] },
                { label: "02 / DESIGN", items: ["2D floor plans and exterior elevations", "Up to 2 rounds of refinement"] },
                { label: "03 / DOCUMENTATION", items: ["Architectural blueprints", "5 printed and bound hardcopy sets"] },
            ],
        },
        {
            name: "Standard", sub: "The Professional", price: "Starting from $2,000", recommended: true,
            desc: "For projects demanding full design exploration, photorealistic visualization, and integrated engineering before a single brick is laid.",
            phases: [
                { label: "01 / MOBILIZATION & CONCEPT", items: ["In-depth multi-session consultation", "On-site and remote site and zoning analysis", "Advanced space planning and moodboard"] },
                { label: "02 / DESIGN & VISUALIZATION", items: ["Detailed 2D floor plans and elevations", "Photorealistic exterior 3D renders", "Up to 3 rounds of refinement"] },
                { label: "03 / DOCUMENTATION", items: ["Detailed architectural blueprints", "Structural engineering drawings", "MEP drawings"] },
                { label: "04 / ENGINEERING & DELIVERY", items: ["Government approval drawing set", "Executive architectural blueprints", "5 printed and bound hardcopy sets each"] },
            ],
        },
        {
            name: "Premium", sub: "The Executive", price: "Starting from $3,200",
            desc: "For high-end builds that need it all, cinematic visuals, full engineering documentation, and a senior consultant involved at every stage.",
            phases: [
                { label: "01 / MOBILIZATION & CONCEPT", items: ["Priority multi-session consultation", "Advanced site and zoning analysis", "Survey and soil test coordination", "Advanced space planning and precedent study"] },
                { label: "02 / DESIGN & VISUALIZATION", items: ["8+ premium exterior 3D renders", "Unlimited rounds of refinement", "Highly detailed 2D plans"] },
                { label: "03 / DOCUMENTATION", items: ["Interior 3D renders for up to 5 spaces", "Animated cinematic video walkthrough", "Full architectural blueprint set"] },
                { label: "04 / ENGINEERING & DELIVERY", items: ["Executive architectural blueprints", "Structural and MEP engineering drawings", "Government approval drawing set"] },
            ],
        },
    ],
    disclaimer: "Pricing shown is based on a one-story residential building on a full plot of land. Total pricing will be confirmed in your proposal and will be billed in your local currency.",
    buildSection: true,
    closing: "From first sketch to final stone.",
};

const INTERIOR: ServiceData = {
    id: "interior",
    index: "02",
    label: "INTERIOR DESIGN",
    headline: ["INTERIOR", "DESIGN."],
    hero: "The interior volume is where architecture is most intimately experienced. The height of a ceiling, the texture of a wall, and the quality of light at noon are spatial decisions resolved with the same rigour applied to structure.",
    image: "/images/services/interior-design.webp",
    imageAlt: "Interior space with considered materiality and proportion",
    approach: "Interior design isn't an afterthought for us; it's part of the same idea that shapes the building from the very beginning.",
    how: [
        ["01", "SPATIAL ANALYSIS", "We start by understanding how you'll use the space, how people move through it, lighting, function, and how rooms relate to each other."],
        ["02", "VISUALIZATION", "We take you from simple layouts to realistic 3D renders and walkthroughs, so you can experience the design before anything is purchased."],
        ["03", "DOCUMENTATION", "We specify every material, finish, and fixture in detail, leaving no room for guesswork on site."],
        ["04", "EXECUTION", "For clients who want full support, we manage purchasing, supervise installation, and oversee styling all the way to handover."],
    ],
    tiers: [
        {
            name: "Basic", sub: "The Essential", price: "Starting from $1,000",
            desc: "Best for clients who want a professional design concept, clear enough to hand to a contractor and start sourcing materials themselves.",
            phases: [
                { label: "01 / SPATIAL PLANNING & CONCEPT", items: ["Initial consultation and briefing", "Site measurement review", "2D furniture layout", "Conceptual moodboard"] },
                { label: "02 / VISUALIZATION", items: ["Standard 3D visualization", "Material palette guide"] },
            ],
        },
        {
            name: "Standard", sub: "The Professional", price: "Starting from $1,900", recommended: true,
            desc: "For clients who want a complete, fully documented interior design that's precise and ready to be built.",
            phases: [
                { label: "01 / SPATIAL PLANNING & CONCEPT", items: ["In-depth multi-session consultation", "Site verification and measurement", "Advanced 2D layouts", "Design moodboard"] },
                { label: "02 / VISUALIZATION & DEVELOPMENT", items: ["Photorealistic 3D renders", "Exact specification schedule", "Furniture sourcing guide"] },
                { label: "03 / TECHNICAL DOCUMENTATION", items: ["Interior elevations and joinery drawings", "5 printed and bound hardcopy sets"] },
            ],
        },
        {
            name: "Premium", sub: "The Executive", price: "Starting from $3,200",
            desc: "For clients who want us to handle everything, from the first assessment of the space to styling the finished, move-in-ready interior.",
            phases: [
                { label: "01 / SPATIAL PLANNING & CONCEPT", items: ["Priority executive consultation", "Full site verification and measurement", "Advanced spatial planning and reflected ceiling plans", "Executive moodboard"] },
                { label: "02 / VISUALIZATION & DEVELOPMENT", items: ["Comprehensive photorealistic 3D renders for key spaces", "Bespoke furniture design", "Animated interior video walkthrough"] },
                { label: "03 / TECHNICAL DOCUMENTATION", items: ["Interior elevations for all rooms", "Custom millwork and cabinetry blueprints", "Tile layout and setting-out plans", "Full build-ready specification set"] },
            ],
        },
    ],
    disclaimer: "Pricing shown is based on interior design for a 4-bedroom residential apartment. Total pricing will be confirmed in your proposal and will be billed in your local currency.",
    buildSection: false,
    closing: "Every void considered. Every surface resolved.",
};

const FAQS = [
    { q: "What services does Vartex Architects provide?", a: "We offer comprehensive architectural design, interior design, and project management services for residential and commercial builds. Our work ranges from essential 2D technical drafting to immersive 3D visualizations, custom joinery design, and construction supervision." },
    { q: "How much does it cost to design a house?", a: "Costs depend on your site and the scope of your project, since every design is different. We offer Basic, Standard, and Premium packages, each with a starting price. The Standard Architecture package is intended for typical residential designs up to roughly 350 sqm; larger or more complex plots get a custom quote." },
    { q: "How are payments structured?", a: "We use a transparent, phased billing structure. Projects are divided into milestones such as Concept, Design Development, and Construction Drawings. You approve and pay for each phase before we move to the next." },
    { q: "Do you handle the actual construction of the building?", a: "We are primarily a design and consulting studio, but we offer Project Management and Construction Administration services. As Lead Consultant, we support contractor tendering, cost evaluation, and regular site inspections to help ensure the building matches the approved architectural design." },
    { q: "Can I customize the design packages?", a: "Yes. Packages contain core and optional deliverables, including structural engineering coordination, mechanical and electrical layouts, and premium physical printing. Optional deliverables can be adjusted during the proposal stage to suit your project." },
    { q: "Do you help with government building approvals?", a: "Yes. Clients who select Standard or Premium architectural packages receive drawing sets prepared, formatted, and collated for submission to your local planning authority." },
    { q: "Do you only take projects in Lagos?", a: "We are based in Lagos and handle many site-specific projects here, but we can provide architectural blueprints, 3D visualizations, and interior design consultation for projects elsewhere as long as you can provide an accurate site survey and measurements." },
    { q: "How do we get started?", a: "Send an email to Info@vartexarchitects.com, message us on WhatsApp at +234 704 900 1510, or call +234 703 269 7179 to schedule your initial consultation. We will discuss your project goals and recommend the most suitable design package." },
];

const initialFormState: GuideState = { message: "", errors: {}, success: false };
const quizInitialState: QuizState = { message: "", errors: {}, success: false };

function GridCTA({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <section className={`relative overflow-hidden bg-primary dark:bg-[#111] text-white ${className}`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs><pattern id="service-grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#service-grid-pattern)" />
                </svg>
            </div>
            <div className="relative z-10">{children}</div>
        </section>
    );
}

function GuideModal({ service, onClose }: { service: string; onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(requestGuideAction, initialFormState);
    useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "unset"; }; }, []);
    return (
        <div onClick={onClose} className="fixed inset-0 z-[999] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:px-4">
            <div onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-md border border-neutral-800 bg-neutral-900 p-8 shadow-2xl sm:rounded-md sm:p-12">
                <button onClick={onClose} className="absolute right-5 top-5 p-2 text-neutral-400 transition-colors hover:text-white" aria-label="Close service guide dialog"><X className="h-5 w-5" /></button>
                {!state.success ? (
                    <div className="flex flex-col gap-6">
                        <div><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-500">SERVICE SCOPE</span><h3 className="mt-2 whitespace-pre-line text-3xl font-black uppercase leading-none tracking-tight text-white">{service === "architecture" ? "ARCHITECTURAL\nDESIGN GUIDE" : "INTERIOR\nDESIGN GUIDE"}</h3></div>
                        <p className="text-base leading-relaxed text-neutral-400">Receive our service overview with deliverables, timelines, and engagement options.</p>
                        <form action={formAction} className="flex flex-col gap-6"><input type="hidden" name="service" value={service} />
                            <label className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.2em] text-white">YOUR NAME<input name="name" type="text" placeholder="John Doe" required className="rounded-sm border border-neutral-700 bg-neutral-800 px-4 py-3 font-sans text-base tracking-normal text-white outline-none placeholder:text-neutral-600 focus:border-white/60" />{state.errors?.name && <span className="font-sans text-sm normal-case tracking-normal text-red-400">{state.errors.name[0]}</span>}</label>
                            <label className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.2em] text-white">EMAIL ADDRESS<input name="email" type="email" placeholder="johndoe@example.com" required className="rounded-sm border border-neutral-700 bg-neutral-800 px-4 py-3 font-sans text-base tracking-normal text-white outline-none placeholder:text-neutral-600 focus:border-white/60" />{state.errors?.email && <span className="font-sans text-sm normal-case tracking-normal text-red-400">{state.errors.email[0]}</span>}</label>
                            {state.message && !state.success && <p className="text-sm text-red-400">{state.message}</p>}
                            <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-sm bg-white py-4 font-mono text-[11px] font-bold tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:opacity-60">{isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> SENDING...</> : "SEND ME THE GUIDE"}</button>
                        </form>
                        <span className="text-center font-mono text-[10px] leading-relaxed tracking-wider text-neutral-500">The guide is delivered by email when the studio delivery files are configured.</span>
                    </div>
                ) : <div className="flex flex-col items-center gap-6 py-8 text-center"><CheckCircle className="h-14 w-14 text-white" /><h3 className="text-2xl font-black uppercase text-white">GUIDE REQUEST RECEIVED.</h3><p className="text-base leading-relaxed text-neutral-400">Please check your inbox. If it does not arrive shortly, check your junk folder.</p><button onClick={onClose} className="rounded-sm bg-white px-10 py-4 font-mono text-[11px] font-bold tracking-[0.2em] text-black">CLOSE</button></div>}
            </div>
        </div>
    );
}

const Q1_OPTIONS = ["Building something new", "Renovating or extending an existing structure", "Transforming an interior space", "I need both architecture and interior design"];
const Q2_OPTIONS = ["Single residential home", "Multi-unit residential", "Commercial or mixed-use", "Not sure yet"];

function recommendation(q1: string) {
    if (q1 === "Transforming an interior space") return { service: "interior", label: "Interior Design", reason: "Your focus maps directly to our Interior Design discipline: spatial planning, visualization, and technical specification." };
    if (q1 === "I need both architecture and interior design") return { service: "both", label: "Architecture + Interior Design", reason: "Your project benefits from an integrated approach that resolves structural form and interior staging together." };
    return { service: "architecture", label: "Architectural Design", reason: "Your project involves new construction or structural work, from site analysis through complete documentation." };
}

function DecisionQuizModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<"q1" | "q2" | "recommendation">("q1");
    const [q1, setQ1] = useState(""); const [q2, setQ2] = useState(""); const [skipBoth, setSkipBoth] = useState(false);
    const [rec, setRec] = useState<ReturnType<typeof recommendation> | null>(null);
    const [quizState, quizAction, isPending] = useActionState(submitQuizAction, quizInitialState);
    useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "unset"; }; }, []);
    return <div onClick={onClose} className="fixed inset-0 z-[999] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:px-4"><div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg rounded-t-md border border-neutral-800 bg-neutral-900 p-8 shadow-2xl sm:rounded-md sm:p-12"><button onClick={onClose} className="absolute right-5 top-5 p-2 text-neutral-500 hover:text-white" aria-label="Close service matching dialog"><X className="h-5 w-5" /></button>
        {quizState.success ? <div className="flex flex-col items-center gap-6 py-8 text-center"><h3 className="text-2xl font-black uppercase text-white">YOUR GUIDE IS ON ITS WAY.</h3><p className="text-base leading-relaxed text-neutral-400">Check your inbox. If it does not arrive shortly, check your junk folder.</p><button onClick={onClose} className="border border-white/30 px-10 py-4 font-mono text-[11px] tracking-[0.2em] text-white">CLOSE</button></div> : step === "q1" ? <div className="flex flex-col gap-7"><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-500">SERVICE MATCHING / 01 / 02</span><h3 className="text-3xl font-black uppercase leading-snug text-white">What are you<br />planning?</h3><div className="flex flex-col gap-2">{Q1_OPTIONS.map((option) => <button key={option} onClick={() => { setQ1(option); setStep("q2"); }} className="border border-neutral-700 px-5 py-4 text-left text-base leading-snug text-white/80 transition-colors hover:border-white/60 hover:text-white">{option}</button>)}</div></div> : step === "q2" ? <div className="flex flex-col gap-7"><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-500">SERVICE MATCHING / 02 / 02</span><h3 className="text-3xl font-black uppercase leading-snug text-white">What is the scale<br />of the project?</h3><div className="flex flex-col gap-2">{Q2_OPTIONS.map((option) => <button key={option} onClick={() => { setQ2(option); setRec(recommendation(q1)); setStep("recommendation"); }} className="border border-neutral-700 px-5 py-4 text-left text-base leading-snug text-white/80 transition-colors hover:border-white/60 hover:text-white">{option}</button>)}</div><button onClick={() => setStep("q1")} className="text-left font-mono text-[11px] tracking-[0.2em] text-neutral-500 hover:text-white">BACK</button></div> : rec && <form action={quizAction} className="flex flex-col gap-6"><input type="hidden" name="service" value={skipBoth ? "both" : rec.service} /><input type="hidden" name="q1" value={q1} /><input type="hidden" name="q2" value={q2} /><div><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-500">OUR RECOMMENDATION</span><h3 className="mt-2 text-3xl font-black uppercase leading-tight text-white">{rec.label}</h3><p className="mt-3 text-base leading-relaxed text-neutral-400">{rec.reason}</p></div><label className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.2em] text-white">YOUR NAME<input name="name" type="text" placeholder="John Doe" required className="rounded-sm border border-neutral-700 bg-neutral-800 px-4 py-3 font-sans text-base tracking-normal text-white outline-none placeholder:text-neutral-600 focus:border-white/60" /></label><label className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.2em] text-white">EMAIL ADDRESS<input name="email" type="email" placeholder="johndoe@example.com" required className="rounded-sm border border-neutral-700 bg-neutral-800 px-4 py-3 font-sans text-base tracking-normal text-white outline-none placeholder:text-neutral-600 focus:border-white/60" /></label>{quizState.message && <p className="text-sm text-red-400">{quizState.message}</p>}<button type="submit" disabled={isPending} className="flex items-center justify-center gap-2 bg-white py-4 font-mono text-[11px] font-bold tracking-[0.2em] text-black disabled:opacity-60">{isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> SENDING...</> : "SEND ME THE GUIDE"}</button><button type="button" onClick={() => { setSkipBoth(true); setRec({ service: "both", label: "Architecture + Interior Design", reason: "We will send the full overview for both disciplines." }); }} className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 hover:text-white">SKIP AND SEND BOTH GUIDES</button><button type="button" onClick={() => setStep("q2")} className="text-left font-mono text-[11px] tracking-[0.2em] text-neutral-500 hover:text-white">BACK</button></form>}
    </div></div>;
}

function FAQSection() {
    const [open, setOpen] = useState<number | null>(0);
    return <section className="service-reveal border-t border-neutral-100 bg-neutral-50 px-8 py-20 dark:border-white/5 dark:bg-neutral-900/10 lg:px-24 lg:py-28"><div className="grid gap-12 lg:grid-cols-12"><div className="lg:col-span-4"><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-400">FREQUENTLY ASKED QUESTIONS</span><h2 className="mt-5 max-w-xs text-4xl font-black uppercase leading-none tracking-tighter text-primary dark:text-white">Clarity before the first line.</h2></div><div className="lg:col-span-8">{FAQS.map((item, index) => <div key={item.q} className="border-t border-neutral-200 dark:border-white/10"><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold text-primary dark:text-white"><span>{item.q}</span><ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open === index ? "rotate-180" : ""}`} /></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${open === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="min-h-0 overflow-hidden"><p className="max-w-2xl pb-6 text-base leading-relaxed text-primary/65 dark:text-white/65">{item.a}</p></div></div></div>)}</div></div></section>;
}

function ServicesIndex({ onOpenQuiz }: { onOpenQuiz: () => void }) {
    return <div className="flex flex-col"><section className="service-reveal border-b border-neutral-100 px-8 pt-0 pb-12 dark:border-white/5 lg:px-24 lg:pt-12 lg:pb-24"><span className="font-mono text-[11px] tracking-[0.4em] text-neutral-400">SERVICES</span><h1 className="mt-7 max-w-3xl text-6xl font-black uppercase leading-[0.86] tracking-tighter text-primary dark:text-white lg:text-[8rem]">Every line<br />serves<br />a purpose.</h1><p className="mt-10 max-w-xl text-lg leading-relaxed text-primary/65 dark:text-white/65 lg:text-xl">Vartex works across two specialized fields: architecture and interior design. In both, we bring the same discipline: careful planning and precise execution.</p></section>
        <section className="grid grid-cols-1 lg:grid-cols-2">{([{ id: "architecture", number: "01", title: "Architectural Design", description: "We design structures from the inside out, beginning with site context, solar orientation, and structural integrity.", image: "/images/services/architectural-design.jpeg", icon: HomeIcon }, { id: "interior", number: "02", title: "Interior Design", description: "We complete the space down to the last detail. From proportions to finishes to custom joinery.", image: "/images/services/interior-design.webp", icon: Sofa }] as const).map((service) => { const Icon = service.icon; return <Link key={service.id} href={`/services/${service.id}`} className="service-reveal service-card group border-b border-r border-neutral-100 bg-white p-8 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/5 dark:bg-background-dark dark:hover:bg-neutral-900 lg:p-16"><div className="service-card-image-stage relative mb-10 aspect-[16/9] overflow-hidden bg-[var(--background)]"><Image src={service.image} alt={`${service.title} service`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="service-card-image object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-active:scale-110 group-focus-visible:scale-110" /></div><div className="flex items-start justify-between gap-6"><div><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-400">{service.number}</span><h2 className="mt-4 text-3xl font-black uppercase leading-none tracking-tight text-primary dark:text-white lg:text-5xl">{service.title}</h2><p className="mt-6 max-w-md text-base leading-relaxed text-primary/65 dark:text-white/65 text-layer transition-colors duration-500">{service.description}</p></div><Icon className="icon-layer mt-1 h-8 w-8 shrink-0 text-primary/25 transition-colors group-hover:text-primary dark:text-white/25 dark:group-hover:text-white duration-500" aria-hidden="true" /></div><span className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.2em] text-primary dark:text-white">EXPLORE THIS SERVICE <ArrowUpRight className="h-4 w-4" /></span></Link>; })}</section>
        <section className="service-reveal bg-neutral-50 px-8 py-20 dark:bg-neutral-900/10 lg:px-24 lg:py-28"><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-400">COORDINATED ENGAGEMENT</span><h2 className="mt-5 text-3xl font-black uppercase tracking-tight text-primary dark:text-white lg:text-5xl">Some projects require both.</h2><p className="mt-6 max-w-2xl text-base leading-relaxed text-primary/65 dark:text-white/65">The best results happen when the building and its interior are designed together, not one after the other. If you&apos;re still deciding on scope, start with a joint design consultation.</p><button onClick={onOpenQuiz} className="mt-10 bg-primary px-8 py-5 font-mono text-[11px] font-bold tracking-[0.2em] text-white transition-colors hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200">HELP ME DECIDE</button></section><FAQSection /></div>;
}

function TierCard({ tier, active, onSelect, mobile }: { tier: Tier; active: boolean; onSelect?: () => void; mobile?: boolean }) {
    const summary = tier.phases.flatMap((phase) => phase.items).slice(0, 6);
    return <article onClick={onSelect} onKeyDown={(event) => { if (mobile && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect?.(); } }} tabIndex={mobile ? 0 : undefined} className={`relative flex h-[620px] min-h-0 flex-col overflow-hidden rounded-[3px] border p-5 shadow-[0_22px_70px_-48px_rgba(20,20,20,0.8)] transition-all duration-500 sm:h-[580px] lg:h-auto lg:min-h-[480px] lg:p-8 ${tier.recommended ? "border-primary/40 bg-primary text-white shadow-[0_26px_90px_-42px_rgba(0,0,0,0.75)] dark:border-white/40 dark:bg-white dark:text-primary" : "border-neutral-200/80 bg-white text-primary shadow-[0_18px_60px_-45px_rgba(20,20,20,0.65)] dark:border-white/15 dark:bg-background-dark dark:text-white"} ${mobile && !active ? "bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:border-white/20" : ""} ${mobile ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-white pt-9" : ""}`}>
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${tier.recommended ? "bg-white/70 dark:bg-primary/70" : "bg-primary/10 dark:bg-white/15"}`} aria-hidden="true" />
        {tier.recommended && (!mobile || active) && <span className={`absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-b-sm px-3 py-1.5 text-center font-mono text-[10px] font-bold tracking-[0.16em] ${tier.recommended ? "bg-white text-primary dark:bg-primary dark:text-white" : ""}`}>MOST OF OUR CLIENTS CHOOSE THIS</span>}
        <h3 className="mt-6 text-2xl font-black uppercase leading-none tracking-tight lg:mt-8 lg:text-3xl">{tier.name}</h3><span className={`mt-2 font-mono text-[10px] tracking-[0.16em] lg:mt-3 lg:text-[11px] ${tier.recommended ? "opacity-70" : "text-neutral-400"}`}>{tier.sub}</span><div className="mt-5 border-y border-current/15 py-3 lg:mt-8 lg:py-5"><span className="block font-mono text-[9px] tracking-[0.16em] opacity-60">STARTING PRICE</span><strong className="mt-1 block text-xl font-bold lg:mt-2 lg:text-2xl">{tier.price}</strong></div><p className={`mt-4 text-sm leading-snug lg:mt-6 lg:text-base lg:leading-relaxed ${tier.recommended ? "opacity-80" : "text-primary/65 dark:text-white/65"}`}>{tier.desc}</p><ul className="mt-5 flex flex-col gap-2 lg:mt-7 lg:gap-3">{summary.map((item) => <li key={item} className="flex gap-2 text-[13px] leading-snug lg:gap-3 lg:text-sm lg:leading-relaxed"><span className="mt-2 h-px w-2 shrink-0 bg-current opacity-50" /><span>{item}</span></li>)}</ul>
    </article>;
}

function TierComparison({ data }: { data: ServiceData }) {
    const foundationIndex = data.tiers.findIndex((tier) => tier.name === "Basic");
    const standardIndex = data.tiers.findIndex((tier) => tier.name === "Standard");
    const [active, setActive] = useState(standardIndex >= 0 ? standardIndex : foundationIndex >= 0 ? foundationIndex : 0);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragStartY, setDragStartY] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const controlsTimer = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const pauseAfterInteraction = () => {};

    const revealControls = () => {
        setShowControls(true);
        if (controlsTimer.current) window.clearTimeout(controlsTimer.current);
        controlsTimer.current = window.setTimeout(() => setShowControls(false), 1800);
    };

    const moveBy = (direction: 1 | -1) => {
        pauseAfterInteraction();
        revealControls();
        setActive((current) => (current + direction + data.tiers.length) % data.tiers.length);
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        setDragStart(event.clientX);
        setDragStartY(event.clientY);
        setDragOffset(0);
        pauseAfterInteraction();
        revealControls();
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragStart === null || dragStartY === null) return;
        const deltaX = event.clientX - dragStart;
        const deltaY = event.clientY - dragStartY;
        if (!isDragging) {
            if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX)) {
                setDragStart(null);
                setDragStartY(null);
                return;
            }
            if (Math.abs(deltaX) < 10 || Math.abs(deltaX) < Math.abs(deltaY)) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
        }
        setDragOffset(Math.max(-140, Math.min(140, deltaX)));
    };

    const onPointerEnd = () => {
        if (dragStart !== null) {
            if (dragOffset < -minSwipeDistance) moveBy(1);
            if (dragOffset > minSwipeDistance) moveBy(-1);
        }
        setDragStart(null);
        setDragStartY(null);
        setDragOffset(0);
        setIsDragging(false);
        pauseAfterInteraction();
    };

    useEffect(() => {
        if (typeof window === "undefined" || !carouselRef.current) return;
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.25 });
        observer.observe(carouselRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || isDragging || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const timer = window.setInterval(() => {
            setActive((current) => (current + 1) % data.tiers.length);
        }, 5500);
        return () => window.clearInterval(timer);
    }, [data.tiers.length, isDragging, isVisible]);

    return <section className="service-reveal border-b border-neutral-100 px-8 py-20 dark:border-white/5 lg:px-24 lg:py-32">
        <div className="max-w-3xl">
            <span className="font-mono text-[11px] tracking-[0.3em] text-neutral-400">ENGAGEMENT MODELS</span>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tighter text-primary dark:text-white lg:text-6xl">Three Service Tiers.</h2>
            <p className="mt-7 text-base leading-relaxed text-primary/65 dark:text-white/65">Choose the level of design support that matches your project complexity. Each tier can be refined in your proposal.</p>
        </div>

        <div className="mt-14 hidden gap-5 lg:grid lg:grid-cols-3">
            {data.tiers.map((tier) => <TierCard key={tier.name} tier={tier} active />)}
        </div>
        <div
            ref={carouselRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className="relative mt-16 min-h-[620px] w-full touch-pan-y [perspective:1100px] sm:min-h-[580px] lg:hidden"
            aria-label={`${data.label} pricing tiers`}
            aria-roledescription="carousel"
        >
            {data.tiers.map((tier, index) => {
                const offset = (index - active + data.tiers.length) % data.tiers.length;
                const isActive = offset === 0;
                const isNext = offset === 1;
                const horizontal = isActive ? `calc(-50% + ${dragOffset}px)` : isNext ? `calc(-15% + ${dragOffset * 0.2}px)` : `calc(-85% + ${dragOffset * 0.2}px)`;
                const rotation = isActive ? Math.max(-3, Math.min(3, dragOffset * 0.025)) : isNext ? -18 : 18;
                const depth = isActive ? 0 : -100;
                return <div key={tier.name} className={`absolute left-1/2 top-0 w-[88%] max-w-[560px] origin-center will-change-transform ${isDragging ? "transition-none" : "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"}`} style={{ zIndex: isActive ? 10 : 5, opacity: isActive ? 1 : 0.68, transform: `translate3d(${horizontal}, ${isActive ? 0 : 28}px, ${depth}px) rotateY(${rotation}deg) scale(${isActive ? 1 : 0.88})` }}>
                    <TierCard tier={tier} active={isActive} mobile onSelect={() => { pauseAfterInteraction(); revealControls(); setActive(index); }} />
                </div>;
            })}
            <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => moveBy(-1)} aria-label="Show previous pricing tier" className={`absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-primary/15 bg-white/80 p-3 text-primary shadow-sm backdrop-blur transition-opacity duration-300 dark:border-white/15 dark:bg-background-dark/80 dark:text-white ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}`}><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => moveBy(1)} aria-label="Show next pricing tier" className={`absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-primary/15 bg-white/80 p-3 text-primary shadow-sm backdrop-blur transition-opacity duration-300 dark:border-white/15 dark:bg-background-dark/80 dark:text-white ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}`}><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 lg:hidden" aria-label="Choose pricing tier">
            {data.tiers.map((tier, index) => <button key={tier.name} type="button" onClick={() => { pauseAfterInteraction(); revealControls(); setActive(index); }} aria-label={`Show tier ${tier.name}`} aria-current={active === index ? "true" : undefined} className={`h-1.5 rounded-full transition-all duration-300 ${active === index ? "w-8 bg-primary dark:bg-white" : "w-1.5 bg-primary/25 dark:bg-white/25"}`} />)}
        </div>
        <p className="sr-only" aria-live="polite">Showing tier {data.tiers[active].name}.</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-primary/55 dark:text-white/55">{data.disclaimer}</p>
    </section>;
}

function ServicesDetail({ data, setPage }: { data: ServiceData; setPage: (p: "index" | "architecture" | "interior") => void }) {
    const [showGuide, setShowGuide] = useState(false);
    return <div className="flex flex-col overflow-x-clip"><div className="service-reveal flex items-center gap-3 border-b border-neutral-100 px-8 py-6 font-mono text-[11px] tracking-[0.15em] text-neutral-400 dark:border-white/5 lg:px-24"><Link href="/services" className="hover:text-primary dark:hover:text-white">SERVICES</Link><span>/</span><span className="text-primary dark:text-white">{data.label}</span></div><section className="service-reveal grid gap-12 border-b border-neutral-100 px-8 pt-0 pb-8 dark:border-white/5 lg:grid-cols-12 lg:px-24 lg:pt-12 lg:pb-28"><div className="lg:col-span-8"><span className="font-mono text-[11px] tracking-[0.35em] text-neutral-400">{data.index} / SERVICE DIRECTORY</span><h1 className="mt-7 text-[clamp(2.35rem,10.4vw,7rem)] font-black uppercase leading-[0.88] tracking-tighter text-primary dark:text-white lg:text-[7rem]">{data.headline.map((line) => <span key={line} className="block">{line}</span>)}</h1><p className="mt-10 max-w-2xl text-xl leading-relaxed text-primary/70 dark:text-white/70 lg:text-2xl">{data.hero}</p></div><div className="flex flex-col gap-3 lg:col-span-4 lg:pt-8"><button onClick={() => setShowGuide(true)} className="bg-primary py-5 font-mono text-[11px] font-bold tracking-[0.2em] text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200">RECEIVE SERVICE GUIDE</button><Link href="/contact" className="border border-neutral-200 py-5 text-center font-mono text-[11px] font-bold tracking-[0.2em] text-primary hover:bg-neutral-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5">START A PROJECT</Link></div></section><div className="service-reveal service-image-stage relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-white dark:bg-background-dark"><div className="service-detail-media group absolute inset-0"><Image src={data.image} alt={data.imageAlt} fill priority sizes="100vw" className="service-detail-image object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-active:scale-110 group-focus-visible:scale-110" /><div className="pointer-events-none absolute inset-0 dark:bg-black/20" /></div></div><section className="service-reveal border-b border-neutral-100 bg-neutral-50 px-8 py-20 dark:border-white/5 dark:bg-neutral-900/10 lg:px-24 lg:py-28"><p className="service-approach-text max-w-4xl text-2xl font-light leading-snug text-primary/80 dark:text-white/80 lg:text-4xl">{data.approach}</p></section><TierComparison data={data} />{data.buildSection && <section className="service-reveal grid gap-12 border-b border-neutral-100 bg-neutral-50 px-8 py-20 dark:border-white/5 dark:bg-neutral-900/10 lg:grid-cols-12 lg:px-24 lg:py-28"><div className="lg:col-span-5"><h2 className="text-4xl font-black uppercase leading-none tracking-tighter text-primary dark:text-white">THE BUILD.</h2><p className="mt-4 text-lg font-medium text-primary/70 dark:text-white/70">Construction Management</p></div><div className="lg:col-span-7"><p className="max-w-xl text-base leading-relaxed text-primary/65 dark:text-white/65">Already have your construction drawings ready? We can step in as lead consultant to manage the project and make sure construction stays true to the design.</p><ul className="mt-8 grid gap-4 sm:grid-cols-2">{["QS coordination and bill of quantities", "Contractor tendering and bid review", "Scheduled on-site verification inspections", "Material mockup approvals", "Payment certificate issuance", "Snag list and final handover packages"].map((item) => <li key={item} className="flex gap-3 text-sm"><span className="mt-3 h-px w-2 shrink-0 bg-current opacity-50" />{item}</li>)}</ul></div></section>}<section className="service-reveal max-lg:hidden border-b border-neutral-100 px-8 py-20 dark:border-white/5 lg:px-24 lg:py-28"><span className="font-mono text-[11px] tracking-[0.3em] text-neutral-400">HOW WE WORK</span><div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">{data.how.map(([num, title, desc]) => <article key={num} className="border-t border-neutral-200 pt-6 dark:border-white/10"><span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400">{num}</span><h3 className="mt-5 text-xl font-bold uppercase leading-tight text-primary dark:text-white">{title}</h3><p className="mt-4 text-base leading-relaxed text-primary/65 dark:text-white/65">{desc}</p></article>)}</div></section><GridCTA className="service-reveal px-8 py-20 lg:px-24 lg:py-24"><div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"><h2 className="text-6xl font-black uppercase leading-none tracking-tighter lg:text-[8rem]">LET&apos;S BUILD.</h2><div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"><button onClick={() => setShowGuide(true)} className="bg-white px-8 py-5 font-mono text-[11px] font-bold tracking-[0.2em] text-primary hover:bg-neutral-100">RECEIVE SERVICE GUIDE</button><Link href="/contact" className="border border-white/50 px-8 py-5 text-center font-mono text-[11px] font-bold tracking-[0.2em] text-white hover:bg-white/10">START A PROJECT</Link></div></div></GridCTA>{showGuide && <GuideModal service={data.id} onClose={() => setShowGuide(false)} />}</div>;
}

export default function ServicesClient({ initialPage = "index" }: { initialPage?: "index" | "architecture" | "interior" }) {
    const [page, setPage] = useState<"index" | "architecture" | "interior">(initialPage);
    const [showQuiz, setShowQuiz] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    useEffect(() => { const requested = new URLSearchParams(window.location.search).get("service"); if (requested === "architecture" || requested === "interior") setPage(requested); }, []);
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".service-reveal:not(.service-card)").forEach((element, index) => {
                gsap.from(element, { y: 28, duration: 0.65, delay: Math.min(index * 0.03, 0.25), ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
            });
            gsap.utils.toArray<HTMLElement>(".service-card-image-stage").forEach((stage) => {
                const image = stage.querySelector<HTMLElement>(".service-card-image");
                if (!image) return;
                // Clip-only reveal: the image element carries CSS transition-transform
                // classes for the hover/tap zoom, so GSAP must never write transform
                // properties on it — a GSAP yPercent here gets re-smoothed by the CSS
                // transition every frame and reads as a bounce/snap-back.
                gsap.fromTo(image, { clipPath: "inset(100% 0 0 0)" }, {
                    clipPath: "inset(0% 0 0 0)",
                    duration: 0.55,
                    ease: "power3.out",
                    clearProps: "clipPath",
                    scrollTrigger: { trigger: stage, start: "top 92%", once: true }
                });
            });
            gsap.utils.toArray<HTMLElement>(".service-image-stage").forEach((stage) => {
                const media = stage.querySelector<HTMLElement>(".service-detail-media");
                if (!media) return;
                gsap.fromTo(media, { clipPath: "inset(100% 0 0 0)" }, {
                    clipPath: "inset(0% 0 0 0)",
                    duration: 0.55,
                    ease: "power3.out",
                    clearProps: "all",
                    scrollTrigger: { trigger: stage, start: "top 75%", once: true }
                });
            });
            gsap.utils.toArray<HTMLElement>(".service-approach-text").forEach((text) => {
                gsap.from(text, {
                    x: -50,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: { trigger: text, start: "top 88%", once: true }
                });
            });
            if (window.matchMedia("(max-width: 1024px)").matches) {
                gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
                    const icon = card.querySelector(".icon-layer");
                    const text = card.querySelector(".text-layer");
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 88%",
                        end: "bottom 30%",
                        onEnter: () => {
                            card.classList.add("service-card-visible");
                            if (icon) { icon.classList.add("text-primary", "dark:text-white"); icon.classList.remove("text-primary/25", "dark:text-white/25"); }
                            if (text) { text.classList.add("text-primary/100", "dark:text-white/100"); text.classList.remove("text-primary/65", "dark:text-white/65"); }
                        },
                        onLeave: () => {
                            card.classList.remove("service-card-visible");
                            if (icon) { icon.classList.remove("text-primary", "dark:text-white"); icon.classList.add("text-primary/25", "dark:text-white/25"); }
                            if (text) { text.classList.remove("text-primary/100", "dark:text-white/100"); text.classList.add("text-primary/65", "dark:text-white/65"); }
                        },
                        onEnterBack: () => {
                            card.classList.add("service-card-visible");
                            if (icon) { icon.classList.add("text-primary", "dark:text-white"); icon.classList.remove("text-primary/25", "dark:text-white/25"); }
                            if (text) { text.classList.add("text-primary/100", "dark:text-white/100"); text.classList.remove("text-primary/65", "dark:text-white/65"); }
                        },
                        onLeaveBack: () => {
                            card.classList.remove("service-card-visible");
                            if (icon) { icon.classList.remove("text-primary", "dark:text-white"); icon.classList.add("text-primary/25", "dark:text-white/25"); }
                            if (text) { text.classList.remove("text-primary/100", "dark:text-white/100"); text.classList.add("text-primary/65", "dark:text-white/65"); }
                        }
                    });
                });
            }
        });
        return () => ctx.revert();
    }, [page]);
    return <div ref={rootRef} className="flex min-h-screen flex-col bg-white pt-20 text-primary dark:bg-background-dark dark:text-white"><Header /><main className="flex-grow">{page === "index" && <ServicesIndex onOpenQuiz={() => setShowQuiz(true)} />}{page === "architecture" && <ServicesDetail data={ARCHITECTURE} setPage={setPage} />}{page === "interior" && <ServicesDetail data={INTERIOR} setPage={setPage} />}</main>{showQuiz && <DecisionQuizModal onClose={() => setShowQuiz(false)} />}<Footer /></div>;
}
