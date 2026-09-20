"use client";

import Link from "next/link";
import Image from "next/image";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
    return (
        <footer className="px-8 lg:px-24 py-12 lg:py-24 bg-white dark:bg-background-dark border-t border-neutral-100 dark:border-white/5 relative overflow-hidden" aria-label="Site footer">

            {/* Background Logo Overlay */}
            <div className="absolute -bottom-24 -right-12 text-[20vw] font-black text-neutral-50 dark:text-white/[0.02] pointer-events-none select-none tracking-tighter uppercase leading-none">
                VARTEX
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                {/* Brand Column */}
                <div className="lg:col-span-4 flex flex-col gap-1 lg:gap-2">
                    <div className="flex flex-col gap-0 items-start">
                        <div className="relative lg:-mt-3.5">
                            {/* Light mode: black logo */}
                            <Image
                                src="/brand-logo-light-transparent.png"
                                alt="VARTEX Logo"
                                width={200}
                                height={200}
                                className="w-auto h-16 lg:h-24 object-contain object-left dark:hidden"
                            />
                            {/* Dark mode: white logo */}
                            <Image
                                src="/brand-logo-dark-transparent.png"
                                alt="VARTEX Logo"
                                width={200}
                                height={200}
                                className="w-auto h-16 lg:h-24 object-contain object-left hidden dark:block"
                            />
                        </div>
                    </div>
                    <p className="-mt-2.5 lg:-mt-4 text-sm font-light text-primary/60 dark:text-white/60 max-w-xs leading-relaxed italic">
                        Architecture built on precision and purpose.
                    </p>
                </div>

                {/* Social Column / SVG Icons on mobile, text on desktop */}
                <div className="lg:col-span-3 lg:col-start-5 flex flex-col gap-4 lg:gap-6">
                    <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">SOCIALS</span>

                    {/* SVG Icons / visible on both mobile and desktop */}
                    <nav className="grid grid-cols-10 gap-x-2.5 gap-y-3 sm:grid-cols-5 lg:gap-x-4 place-items-start">
                        {/* Instagram */}
                        <a href="https://www.instagram.com/vartex_architects?igsh=MWsxNDJqZmJ4aXEwNA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/company/vartexarchitects/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>

                        {/* X (Twitter) */}
                        <a href="https://x.com/VartexArchitect" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                        </a>

                        {/* Threads Icon */}
                        <a href="https://www.threads.net/@vartex_architects" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                                <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                            </svg>
                        </a>

                        {/* WhatsApp */}
                        <a href="https://wa.me/message/WCAUBNIBDXOSF1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d='M9.516.012C4.206.262.017 4.652.033 9.929a9.798 9.798 0 0 0 1.085 4.465L.06 19.495a.387.387 0 0 0 .47.453l5.034-1.184a9.981 9.981 0 0 0 4.284 1.032c5.427.083 9.951-4.195 10.12-9.58C20.15 4.441 15.351-.265 9.516.011zm6.007 15.367a7.784 7.784 0 0 1-5.52 2.27 7.77 7.77 0 0 1-3.474-.808l-.701-.347-3.087.726.65-3.131-.346-.672A7.62 7.62 0 0 1 2.197 9.9c0-2.07.812-4.017 2.286-5.48a7.85 7.85 0 0 1 5.52-2.271c2.086 0 4.046.806 5.52 2.27a7.672 7.672 0 0 1 2.287 5.48c0 2.052-.825 4.03-2.287 5.481z' />
                                <path d='M14.842 12.045l-1.931-.55a.723.723 0 0 0-.713.186l-.472.478a.707.707 0 0 1-.765.16c-.913-.367-2.835-2.063-3.326-2.912a.694.694 0 0 1 .056-.774l.412-.53a.71.71 0 0 0 .089-.726L7.38 5.553a.723.723 0 0 0-1.125-.256c-.539.453-1.179 1.14-1.256 1.903-.137 1.343.443 3.036 2.637 5.07 2.535 2.349 4.566 2.66 5.887 2.341.75-.18 1.35-.903 1.727-1.494a.713.713 0 0 0-.408-1.072z' />
                            </svg>
                        </a>

                        {/* Pinterest */}
                        <a href="https://www.pinterest.com/vartex_architects" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.89 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.397 2.967 7.397 6.93 0 4.136-2.607 7.464-6.227 7.464-1.215 0-2.359-.631-2.75-1.378l-.748 2.853c-.27 1.029-.997 2.32-1.488 3.114 1.127.348 2.324.537 3.565.537 6.621 0 11.988-5.367 11.988-11.987C23.999 5.368 18.632 0 12.017 0z" />
                            </svg>
                        </a>

                        {/* Behance */}
                        <a href="https://www.behance.net/vartexarchitects" target="_blank" rel="noopener noreferrer" aria-label="Behance" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" />
                            </svg>
                        </a>

                        {/* Facebook */}
                        <a href="https://www.facebook.com/vartexarchitects" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a href="https://www.youtube.com/channel/UCdISTvQJrotB6peWEKhbjRw" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                                <polygon points="10 9 15 12 10 15" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a href="https://www.tiktok.com/@vartex_architects" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:opacity-40 transition-opacity text-primary dark:text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77 0 2.89 2.89 0 0 1 2.89-2.89h.6V8.67h-.6a6.34 6.34 0 1 0 6.34 6.34V8.41a8.45 8.45 0 0 0 3.77 1.13v-3.45z" />
                            </svg>
                        </a>
                    </nav>
                </div>



                {/* Contact Column */}
                <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-3 lg:gap-3 lg:text-right">
                    <span className="font-mono text-[10px] tracking-[0.4em] text-primary/40 dark:text-white/40 uppercase">CONTACT US</span>
                    <div className="flex flex-col gap-1.5 lg:items-end">
                        <a href="tel:+2347049001510" className="text-lg font-bold text-primary dark:text-white uppercase leading-none tracking-widest hover:opacity-50 transition-opacity">+234 704 900 1510</a>
                        <a href="tel:+2347032697179" className="text-lg font-bold text-primary dark:text-white uppercase leading-none tracking-widest hover:opacity-50 transition-opacity">+234 703 269 7179</a>
                        <a href="mailto:info@vartexarchitects.com" className="text-lg font-bold text-primary dark:text-white leading-none hover:opacity-50 transition-opacity break-words">info@vartexarchitects.com</a>
                    </div>
                </div>

            </div>

            {/* Sub Footer */}
            <div className="relative z-10 mt-12 lg:mt-24 pt-8 lg:pt-12 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 lg:gap-8 font-mono text-[9px] tracking-[0.2em] text-primary/30 dark:text-white/30 uppercase">
                <div className="flex gap-8">
                    <Link href="/privacy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-primary dark:hover:text-white">Terms of Service</Link>
                </div>
                <span>© 2026 VARTEX ARCHITECTS</span>
            </div>
        </footer>
    );
}
