// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default async function middleware(req: NextRequest) {
    const session = await auth()
    const response = NextResponse.next()

    if (!req.cookies.get('session_id') && !req.cookies.get('user_id')) {
        response.cookies.set('session_id', crypto.randomUUID(), {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })
    }

    return response
}
