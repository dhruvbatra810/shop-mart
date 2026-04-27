import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/lib/auth';

export const revalidate = 86400;

export default async function LandingPage() {
    return (
        <main className="flex-1 flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-zinc-900 overflow-hidden">
                {/* Background Image & Overlay */}
                <Image src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" width={2070} height={1380} alt="Hero Image" className="absolute inset-0 bg-cover bg-center" priority />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/80 z-10" />

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <span className="text-teal-400 font-semibold tracking-wider uppercase text-sm mb-4">New Arrival</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Summer Season is Here.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light">
                        Discover our new collection of lightweight, breathable fabrics designed to keep you cool when the temperatures rise.
                    </p>
                    <div className="flex gap-4 flex-col sm:flex-row">
                        <Link href="/products?query=summer" className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors">
                            Shop Summer
                        </Link>
                        <Link href="/products" className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors">
                            View All Items
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Collections Section */}
            <section className="py-24 px-4 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Summer Essentials</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
                            Upgrade your wardrobe with our latest pieces crafted for maximum comfort and style.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Shirts Collection */}
                        <Link href="products?query=premium%20shirts" className="group relative h-[500px] rounded-3xl overflow-hidden bg-zinc-100 flex items-end p-8 sm:p-10">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1976&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="relative z-10 w-full flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Premium Shirts</h3>
                                    <p className="text-zinc-300 font-light text-base">Everyday staples for any occasion</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Shorts Collection */}
                        <Link href="/products?query=summer" className="group relative h-[500px] rounded-3xl overflow-hidden bg-zinc-100 flex items-end p-8 sm:p-10">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="relative z-10 w-full flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Summer Shorts</h3>
                                    <p className="text-zinc-300 font-light text-base">Lightweight & breathable</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}