import { db } from "@/db"
import { carts, products } from "@/db/schema";
import ProductList from "./productList";
import { or, ilike } from "drizzle-orm";
import { cookies } from "next/headers";
import { getCartBySessionId } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<{ query?: string }> }) {
    let prod = []
    const cookieStore = await cookies();
    const param = await searchParams;
    if (!param?.query) {
        // ✅ fetch all
        prod = await db.select().from(products);
    } else {
        // ✅ filtered search
        prod = await db
            .select()
            .from(products)
            .where(
                or(
                    ilike(products.name, `%${param?.query}%`),
                    ilike(products.description, `%${param?.query}%`)
                )
            );
    }
    const cartMap = new Map();
    if (false) {

    } else {
        const tempcart = await getCartBySessionId(undefined);
        tempcart.forEach((item) => {
            cartMap.set(item.productId, item.quantity)
        })
    }
    console.log(cartMap)
    // console.log(prod, searchParams)
    return <div className="flex flex-col flex-1 bg-white h-full">
        {prod.length > 0 && <ProductList products={prod} cartMap={cartMap} />}
        {prod.length === 0 && <div className=" col-span-full text-center py-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">No products found</h2>
            <p className="text-zinc-600">Try adjusting your search or filters</p>
        </div>
        }
    </div>
}