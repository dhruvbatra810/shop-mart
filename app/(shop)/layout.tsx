import CartProvider from "@/lib/contexts/cartContext";
import { db } from "@/db";
import { carts } from "@/db/schema";
import NavBarWrapper from "@/components/navbarWrapper";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || '';
    let cartSize = 0;
    if (userId) {
        const v = await db.select().from(carts).where(eq(carts.userId, userId));
        cartSize = v.reduce((acc, cart) => acc + cart.quantity, 0);
    } else {
        const sessionId = cookieStore.get('session_id')?.value || '';
        const v = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
        cartSize = v.reduce((acc, cart) => acc + cart.quantity, 0);
    }
    return <>

        <CartProvider initialCartSize={cartSize} >
            <Suspense fallback={null} >
                <NavBarWrapper />
            </Suspense>
            {children}
        </CartProvider>
    </>
}