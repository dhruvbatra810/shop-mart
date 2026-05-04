// app/api/create-payment-intent/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const { currency = "INR", amount, orderId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: { orderId },
    },{
        idempotencyKey: orderId
    });

    await db.update(orders)
        .set({ paymentIntentId: paymentIntent.id })
        .where(eq(orders.id, orderId))

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
