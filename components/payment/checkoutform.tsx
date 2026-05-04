// components/CheckoutForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ amount, orderId }: { amount: number; orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setError(error.message ?? 'Payment failed');
      setLoading(false);
    }
    // On success, Stripe redirects to return_url
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
      >
        {loading ? 'Processing...' : `Pay ₹${amount / 100}`}
      </button>
    </form>
  );
}

export default function Checkout({ amount, orderId }: { amount: number; orderId: string }) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    setLoading(true);
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId }),
    });
    const data = await res.json();
    setClientSecret(data.clientSecret);
    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <button
        onClick={handleProceed}
        disabled={loading}
        className="w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
      >
        {loading ? 'Loading...' : 'Proceed to Pay'}
      </button>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm amount={amount} orderId={orderId} />
    </Elements>
  );
}