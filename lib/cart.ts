import { db } from "@/db";
import { cookies } from "next/headers"
import { and, eq } from "drizzle-orm";
import { carts, products } from "@/db/schema";

export async function getCartBySessionId(productId: string | undefined) {
    const cookieStore = await cookies();
    const sessionID = cookieStore.get('session_id')?.value;
    if (productId && sessionID) {
        const items = await db.select().from(carts).where(and(eq(carts.productId, productId), eq(carts.sessionId, sessionID)))
        return items;
    } else if (sessionID) {
        const items = await db.select().from(carts).where(eq(carts.sessionId, sessionID))
        return items;
    }
    return []
}

export async function getPopulatedCart() {
    const cookieStore = await cookies();
    const sessionID = cookieStore.get('session_id')?.value;
    if (!sessionID) return [];
    
    return await db.select({
        cart: carts,
        product: products,
    })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .where(eq(carts.sessionId, sessionID));
}
