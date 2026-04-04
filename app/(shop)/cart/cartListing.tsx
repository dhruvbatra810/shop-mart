'use client'
import { useState, useContext, useTransition } from "react"
import Image from "next/image"
import { Cartcontext } from "@/lib/contexts/cartContext"
import { updateCartQuantity, removeFromCart } from "@/lib/server-action"
import Link from "next/link"

export default function CartListing({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems)
    const { setCartCount } = useContext(Cartcontext)
    const [isPending, startTransition] = useTransition()
    const [coupon, setCoupon] = useState("")

    const handleQuantityChange = (productId: string, delta: number, currentQuantity: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;
        
        // Optimistic update
        setItems(prev => prev.map(item => 
            item.cart.productId === productId 
                ? { ...item, cart: { ...item.cart, quantity: newQuantity } }
                : item
        ))
        setCartCount((prev: number) => prev + delta)

        // Server action
        startTransition(() => {
            updateCartQuantity(productId, newQuantity)
        })
    }

    const handleRemove = (productId: string, quantityToRemove: number) => {
        setItems(prev => prev.filter(item => item.cart.productId !== productId))
        setCartCount((prev: number) => prev - quantityToRemove)
        
        startTransition(() => {
            removeFromCart(productId)
        })
    }

    const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.cart.quantity), 0)
    const discount = coupon === "DISCOUNT10" ? subtotal * 0.1 : 0
    const total = subtotal - discount

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-zinc-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h2>
                <p className="text-zinc-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/products" className="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]">
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Shopping Cart</h1>
                {items.map((item) => (
                    <div key={item.cart.id} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200">
                        <Link href={`/products/${item.product.id}`} className="relative w-24 h-24 sm:w-28 sm:h-28 bg-zinc-100 rounded-xl overflow-hidden shrink-0 group">
                            <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between h-full">
                            <div>
                                <Link href={`/products/${item.product.id}`} className="hover:underline decoration-zinc-300 underline-offset-4">
                                    <h3 className="font-semibold text-lg text-zinc-900 line-clamp-1">{item.product.name}</h3>
                                </Link>
                                <p className="text-zinc-500 text-sm mb-3 mt-1 capitalize">{item.product.category}</p>
                            </div>
                            <p className="font-bold text-zinc-900 text-lg">₹{item.product.price}</p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-3">
                            <div className="flex items-center bg-zinc-100 rounded-xl p-1 gap-1">
                                <button 
                                    onClick={() => handleQuantityChange(item.cart.productId, -1, item.cart.quantity)}
                                    className="bg-white rounded-lg p-2 sm:p-2.5 shadow-sm text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50 active:scale-[0.98]"
                                    disabled={item.cart.quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                                </button>
                                <span className="font-semibold px-4 w-12 text-center text-zinc-900">{item.cart.quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(item.cart.productId, 1, item.cart.quantity)}
                                    className="bg-white rounded-lg p-2 sm:p-2.5 shadow-sm text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50 active:scale-[0.98]"
                                    disabled={item.cart.quantity >= item.product.stock}
                                    aria-label="Increase quantity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                </button>
                            </div>
                            <button onClick={() => handleRemove(item.cart.productId, item.cart.quantity)} className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors active:scale-95 px-2">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:w-1/3">
                <div className="bg-zinc-50 p-6 sm:p-8 rounded-3xl border border-zinc-200 sticky top-24">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">Order Summary</h2>
                    
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex justify-between items-center text-zinc-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-zinc-900 text-right">₹{subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between items-center text-emerald-600 font-medium">
                                <span>Discount</span>
                                <span className="text-right">-₹{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-start gap-4 text-zinc-600 pb-5 border-b border-zinc-200">
                            <span className="shrink-0">Shipping</span>
                            <span className="text-zinc-900 text-right">Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 gap-4">
                            <span className="font-bold text-xl text-zinc-900 shrink-0">Total</span>
                            <span className="font-bold text-3xl text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis text-right max-w-[200px]">₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-sm font-medium text-zinc-700 block mb-2 px-1">Coupon Code</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={coupon}
                                onChange={e => setCoupon(e.target.value.toUpperCase())}
                                placeholder="e.g. DISCOUNT10"
                                className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow uppercase font-medium placeholder:text-zinc-400 placeholder:font-normal placeholder:normal-case"
                            />
                        </div>
                    </div>

                    <button className="relative w-full bg-zinc-900 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] mb-6 flex items-center justify-center overflow-hidden">
                        Proceed to Checkout
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="absolute right-6 w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                    
                    <p className="text-xs text-zinc-500 font-medium text-center flex items-center justify-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        Secure Checkout & Payments
                    </p>
                </div>
            </div>
        </div>
    )
}