import { db } from "@/db"
import { carts, products } from "@/db/schema";
import ProductList from "./productList";
import { or, ilike } from "drizzle-orm";
import { cookies } from "next/headers";
import { getCartBySessionId, getCartByUserId } from "@/lib/cart";

// export const dynamic = "force-dynamic";
export const revalidate = 5;

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<{ query?: string }> }) {
    let prod = []
    const cookieStore = await cookies();
    const param = await searchParams;
    if (!param?.query) {
        prod = await db.select().from(products);
    } else {
        const res = await fetch(`${process.env.SHOP_MART_BASE_API}/api/search`, {
            method: 'POST',
            body: JSON.stringify({ query: param?.query })
        })
        const data = await res.json();
        prod = data.products;
    }
    const cartMap = new Map();
    if (cookieStore.get('user_id')?.value) {
        const tempcart = await getCartByUserId(undefined);
        tempcart.forEach((item) => {
            cartMap.set(item.productId, item.quantity)
        })
    } else {
        const tempcart = await getCartBySessionId(undefined);
        tempcart.forEach((item) => {
            cartMap.set(item.productId, item.quantity)
        })
    }
    return <div className="flex flex-col flex-1 bg-white h-full">
        {prod.length > 0 && <ProductList products={prod} cartMap={cartMap} />}
        {prod.length === 0 && <div className=" col-span-full text-center py-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">No products found</h2>
            <p className="text-zinc-600">Try adjusting your search or filters</p>
        </div>
        }
    </div>
}