'use client'
import { createContext, useContext, useState } from "react"
export const Cartcontext = createContext({ cartCount: 0, setCartCount: (value: number | ((prev: number) => number)) => { } })
export default function CartProvider({ children, initialCartSize }: { children: React.ReactNode, initialCartSize: number }) {
    const [cartCount, setCartCount] = useState(initialCartSize)
    return <Cartcontext.Provider value={{ cartCount, setCartCount }}>
        {children}
    </Cartcontext.Provider>
}