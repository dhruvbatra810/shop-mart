"use client"
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cartcontext } from "@/lib/contexts/cartContext";
import { Theme } from "@/lib/types";

export default function NavBar({ session }: { session: any }) {
    const { cartCount } = useContext(Cartcontext);
    const searchParam = useSearchParams();
    const [query, setQuery] = useState(searchParam.get("query") || "");
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        setTheme((localStorage.getItem('theme') as Theme) || 'light');
    }, []);
    const router = useRouter();
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/products?query=${query}`)
    };

    const handleTheme = (theme: Theme) => {
        localStorage.setItem('theme', theme);
        if(theme === 'dark'){
            document.documentElement.classList.add(theme)
            document.documentElement.classList.remove('light')
        }else {
               document.documentElement.classList.add(theme)
            document.documentElement.classList.remove('dark')
        }
        setTheme(theme);
    }

    const toggleTheme = () => handleTheme(theme === 'light' ? 'dark' : 'light');
    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-700 shadow-sm transition-all pb-3 pt-3 sm:py-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center min-h-[64px] gap-4">

                    {/* Logo & Mobile Top Row */}
                    <div className="flex justify-between items-center">
                        <Link href="/" className="shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent tracking-tight">
                                ShopSmart
                            </span>
                        </Link>

                        {/* Mobile Links (visible before wrap) */}
                        <div className="flex items-center gap-4 sm:hidden">
                            <button onClick={toggleTheme} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer" aria-label="Toggle theme">
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                    </svg>
                                )}
                            </button>
                            <Link href="/cart" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white box-content">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/login" className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-4 py-1.5 rounded-full font-medium text-sm transition-all">
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar - Responsive */}
                    <div className="flex-1 w-full sm:max-w-xl sm:px-8">
                        <form onSubmit={handleSearch} className="relative flex items-center w-full group">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for products, categories..."
                                className="w-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm rounded-full pl-5 pr-24 py-2.5 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-600 transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <span className="hidden xs:inline">Search</span>
                            </button>
                        </form>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden sm:flex items-center gap-6">
                        <Link href="/cart" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium text-sm transition-colors flex items-center gap-2">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white box-content">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden lg:block">Cart</span>
                        </Link>

                        <Link href="/profile" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium text-sm transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span className="hidden lg:block">Profile</span>
                        </Link>

                        <button onClick={toggleTheme} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer" aria-label="Toggle theme">
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            )}
                        </button>

                        {!session && <Link href="/login" className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-5 py-2 rounded-full font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center">
                            Login
                        </Link>}
                    </div>

                </div>
            </div>
        </nav>
    );
}
