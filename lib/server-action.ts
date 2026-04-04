'use server'

import { db } from "@/db";
import { carts } from "@/db/schema";
import { sql, and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"

export async function addToCart(formData: FormData) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    const productId = formData.get('productId') as string;
    const quantity = Number(formData.get('quantity') || 0);
    if (false) {

    } else {
        await db.insert(carts).values({
            id: crypto.randomUUID(),
            sessionId,
            productId,
            quantity,
        }).onConflictDoUpdate({
            target: [carts.sessionId, carts.productId],
            set: { quantity: sql`${carts.quantity} + ${quantity}` }
        })
    }
    revalidatePath('/products')
    revalidatePath(`/products/${productId}`)
}

export async function updateCartQuantity(productId: string, quantity: number) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) return;
    
    await db.update(carts)
        .set({ quantity })
        .where(
            and(
                eq(carts.sessionId, sessionId),
                eq(carts.productId, productId)
            )
        );
    revalidatePath('/cart');
}

export async function removeFromCart(productId: string) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) return;
    
    await db.delete(carts)
        .where(
            and(
                eq(carts.sessionId, sessionId),
                eq(carts.productId, productId)
            )
        );
    revalidatePath('/cart');
}
