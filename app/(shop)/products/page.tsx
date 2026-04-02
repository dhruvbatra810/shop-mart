import { db } from "@/db"
import { products } from "@/db/schema";
import ProductList from "./productList";
import { or, ilike } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<{ query?: string }> }) {
    let prod = []
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
    // console.log(prod, searchParams)
    return <div className="flex flex-col flex-1 bg-white h-full">
        {prod.length > 0 && <ProductList products={prod} />}
        {prod.length === 0 && <div className=" col-span-full text-center py-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">No products found</h2>
            <p className="text-zinc-600">Try adjusting your search or filters</p>
        </div>
        }
    </div>
}