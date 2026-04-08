import AddCartButton from "@/components/addCartButton";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getCartBySessionId, getCartByUserId } from "@/lib/cart";
import { addToCart } from "@/lib/server-action";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 5;

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const cookieStore = await cookies();
    // Fetch product from neon db
    const productArr = await db.select().from(products).where(eq(products.id, id));

    if (productArr.length === 0) {
        notFound();
    }

    const product = productArr[0];
    console.log(product, 'productarr')
    let cartquantity = 0
    if (cookieStore.get('user_id')?.value) {
        const tempcart = await getCartByUserId(product.id);
        if (tempcart.length > 0) {
            cartquantity = tempcart[0].quantity
        }
    } else {
        const tempcart = await getCartBySessionId(product.id);
        if (tempcart.length > 0) {
            cartquantity = tempcart[0].quantity
        }
    }

    return (
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-white h-full flex-1">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">

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
                        <AddCartButton product={product} quantity={cartquantity} />
                    </div>
                </div>
            </div>
        </div>
    );
}