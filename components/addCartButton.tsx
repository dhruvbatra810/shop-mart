'use client'
import { addToCart } from "@/lib/server-action"
import { Product } from "./productCard"
import { useContext, useState } from "react"
import { Cartcontext } from "@/lib/contexts/cartContext"
export default function AddCartButton({ product, quantity }: { product: Product, quantity: number }) {
  const { setCartCount } = useContext(Cartcontext)
  const [count, setCount] = useState(quantity)
  return <>
    {count > 0 ? (
      <div className="mt-auto flex items-center justify-between w-full bg-zinc-100 rounded-xl p-1 gap-1">
        <form action={addToCart} className="flex-1">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value="-1" />
          <button onClick={() => { setCartCount((prev: number) => prev - 1); setCount(count - 1) }} className="w-full bg-white rounded-lg py-2.5 shadow-sm text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center justify-center active:scale-[0.98]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
        </form>
        <span className="font-semibold text-zinc-900 px-4">{count}</span>
        <form action={addToCart} className="flex-1">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value="1" />
          <button disabled={product.stock === count} onClick={() => { setCartCount((prev: number) => prev + 1); setCount(count + 1) }} className="w-full bg-white rounded-lg py-2.5 shadow-sm text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </form>
      </div>
    ) : (
      <form action={addToCart}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="quantity" value="1" />

        <button
          disabled={product.stock === 0}
          className="mt-auto w-full bg-zinc-900 hover:bg-zinc-800 text-white disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed border-none rounded-xl px-4 py-3 font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => { setCartCount((prev: number) => prev + 1); setCount(count + 1) }}
        >
          Add to Cart
        </button>
      </form>
    )}
  </>
}  