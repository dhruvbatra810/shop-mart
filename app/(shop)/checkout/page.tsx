import { redirect } from 'next/navigation'
import Checkout from '@/components/payment/checkoutform'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; orderId?: string }>
}) {
  const { amount, orderId } = await searchParams
  const parsed = amount ? parseInt(amount, 10) : NaN

  if (!amount || isNaN(parsed) || parsed <= 0 || !orderId) {
    redirect('/cart')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Checkout</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">Complete your purchase securely.</p>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-sm">
          <Checkout amount={parsed} orderId={orderId} />
        </div>
      </div>
    </div>
  )
}
