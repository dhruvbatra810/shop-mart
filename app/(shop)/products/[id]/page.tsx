import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 5;

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch product from neon db
    const productArr = await db.select().from(products).where(eq(products.id, id));

    if (productArr.length === 0) {
        notFound();
    }

    const product = productArr[0];

    return (
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-white h-full flex-1">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">

                {/* Left side: Image */}
                <div className="w-full md:w-1/2">
                    <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>

                {/* Right side: Details */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <span className="text-zinc-500 font-medium tracking-wide uppercase text-sm mb-2">
                        {product.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                        {product.name}
                    </h1>
                    <p className="text-3xl font-semibold text-zinc-900 mb-6">
                        ₹{product.price}
                    </p>

                    <div className="prose prose-zinc max-w-none text-zinc-600 mb-8 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-zinc-900 w-24">Availability:</span>
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {product.occasion && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-zinc-900 w-24">Occasion:</span>
                                <span className="text-sm font-medium text-zinc-600 capitalize bg-zinc-100 px-3 py-1 rounded-full">
                                    {product.occasion}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 border-t border-zinc-200 pt-8 flex gap-4">
                        <button
                            disabled={product.stock === 0}
                            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed border-none rounded-2xl px-8 py-4 font-semibold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] disabled:shadow-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}