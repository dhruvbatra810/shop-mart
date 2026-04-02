import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white px-4 text-center">
            <div className="bg-zinc-50 rounded-full p-6 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-zinc-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">Product Not Found</h2>
            <p className="text-zinc-500 mb-8 max-w-sm text-base">
                We couldn't find the product you were looking for. It may have been removed or the link might be broken.
            </p>
            <Link
                href="/products"
                className="bg-zinc-900 hover:bg-zinc-800 text-white border-none rounded-xl px-8 py-3.5 font-medium transition-all active:scale-[0.98] inline-flex items-center justify-center shadow-sm"
            >
                Browse All Products
            </Link>
        </div>
    );
}