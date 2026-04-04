import NavBar from "@/components/navbar";
import CartProvider from "@/lib/contexts/cartContext";
import { db } from "@/db";
import { carts } from "@/db/schema";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const v = await db.select().from(carts);
    const cartSize = v.reduce((acc, cart) => acc + cart.quantity, 0);
    return <>
        <CartProvider initialCartSize={cartSize} >
            <NavBar />
            {children}
        </CartProvider>
    </>
}