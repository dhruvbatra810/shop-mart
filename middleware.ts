import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
    const response = NextResponse.next()

    if (!request.cookies.get('session_id')) {
        response.cookies.set('session_id', crypto.randomUUID(), {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        })
    }

    return response
}