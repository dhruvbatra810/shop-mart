import { getPopulatedCart } from "@/lib/cart";
import CartListing from "./cartListing";

export default async function Cart() {
    let items = [];
    items = await getPopulatedCart();
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CartListing initialItems={items} />
    </div>
}