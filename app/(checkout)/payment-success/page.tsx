"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccess(){
    const router = useRouter();

    useEffect(()=>{
        setTimeout(()=>{
            router.push('/')
        },1000)
    },[])
    const param = useSearchParams();
    const status = param.get('redirect_status')
    return <div>
       {status === 'succeeded' ? '✅ Payment successful!' : '❌ Payment failed'}
    </div>
}