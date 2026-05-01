import {create} from "zustand"

type CartStore = {
    cartCount: number
    setCartCount: (count:number)=> void
    increment: ()=>void
    decrement: ()=>void
    handleQuantityChange: (count:number)=>void
}

export const useCart = create<CartStore>((set)=>({
    cartCount : 0,
    setCartCount: (count:number)=> {set({cartCount:count})},
    increment: ()=>set((state)=>({cartCount:state.cartCount+1})),
    decrement:  ()=>set((state)=>({cartCount:state.cartCount-1})),
    handleQuantityChange: (count: number)=>{set((state)=>({cartCount:state.cartCount + count}))}
}))