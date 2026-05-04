import { db } from "@/db";
import { orders } from "@/db/schema";
import { auth } from "@/lib/auth"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

const STATUS_STYLES: Record<string, string> = {
    pending:         'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    placed:          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    shipped:         'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    delivered:       'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    payment_failed:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function Page() {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value
    if (!userId) redirect('/login')

    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId))

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Your Orders</h1>

                {userOrders.length === 0 ? (
                    <p className="text-zinc-500 dark:text-zinc-400">No orders yet.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {userOrders.map((order) => {
                            const items: { productId: string; quantity: number }[] = JSON.parse(order.items)
                            const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xs text-zinc-400 font-mono">{order.id}</p>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1 mb-4">
                                        {items.map((item) => (
                                            <p key={item.productId} className="text-sm text-zinc-600 dark:text-zinc-400">
                                                Product ID: <span className="font-mono text-zinc-800 dark:text-zinc-200">{item.productId}</span>
                                                <span className="ml-2 text-zinc-400">× {item.quantity}</span>
                                            </p>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                                        <p className="text-xs text-zinc-400">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                        </p>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            ₹{Number(order.total).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
