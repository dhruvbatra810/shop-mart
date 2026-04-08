'use server'

import { db } from "@/db";
import { carts } from "@/db/schema";
import { sql, and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"

export async function addToCart(formData: FormData) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const sessionId = cookieStore.get('session_id')?.value;
    const productId = formData.get('productId') as string;
    const quantity = Number(formData.get('quantity') || 0);

    if (userId) {
        await db.insert(carts).values({
            id: crypto.randomUUID(),
            userId,
            productId,
            quantity,
        }).onConflictDoUpdate({
            target: [carts.userId, carts.productId],
            set: { quantity: sql`${carts.quantity} + ${quantity}` }
        })
        await db.delete(carts).where(and(eq(carts.userId, userId), eq(carts.productId, productId), sql`${carts.quantity} <= 0`))
    } else if (sessionId) {
        await db.insert(carts).values({
            id: crypto.randomUUID(),
            sessionId,
            productId,
            quantity,
        }).onConflictDoUpdate({
            target: [carts.sessionId, carts.productId],
            set: { quantity: sql`${carts.quantity} + ${quantity}` }
        })
        await db.delete(carts).where(and(eq(carts.sessionId, sessionId), eq(carts.productId, productId), sql`${carts.quantity} <= 0`))
    }

    revalidatePath('/products')
    revalidatePath(`/products/${productId}`)
}

export async function updateCartQuantity(productId: string, quantity: number) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const sessionId = cookieStore.get('session_id')?.value;

    if (userId) {
        await db.update(carts)
            .set({ quantity })
            .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));
    } else if (sessionId) {
        await db.update(carts)
            .set({ quantity })
            .where(and(eq(carts.sessionId, sessionId), eq(carts.productId, productId)));
    }

    revalidatePath('/cart');
}

export async function removeFromCart(productId: string) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const sessionId = cookieStore.get('session_id')?.value;

    if (userId) {
        await db.delete(carts)
            .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));
    } else if (sessionId) {
        await db.delete(carts)
            .where(and(eq(carts.sessionId, sessionId), eq(carts.productId, productId)));
    }

    revalidatePath('/cart');
}

