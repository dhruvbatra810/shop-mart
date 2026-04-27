'use client'

import { useEffect } from "react"

export default function ThemeProvider({children}:{children:React.ReactNode}){
    useEffect(()=>{
        const v = localStorage.getItem('theme');
        if(v === 'dark'){
            document.documentElement.classList.add('dark');
             document.documentElement.classList.remove('light');
        }else {
            document.documentElement.classList.add('light');
             document.documentElement.classList.remove('dark');
        }
    },[])
    return <>{children}</>
}