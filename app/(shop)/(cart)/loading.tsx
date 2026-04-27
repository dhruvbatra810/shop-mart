function CartItemSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200">
            {/* Thumbnail */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-200 rounded-xl animate-pulse shrink-0" />
            {/* Name + category + price */}
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-5 w-2/3 bg-zinc-200 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-zinc-200 rounded animate-pulse" />
                <div className="h-5 w-16 bg-zinc-200 rounded animate-pulse mt-2" />
            </div>
            {/* Quantity controls + remove */}
            <div className="flex sm:flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
                <div className="h-10 w-32 bg-zinc-200 rounded-xl animate-pulse" />
                <div className="h-4 w-14 bg-zinc-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart items */}
            <div className="lg:w-2/3 flex flex-col gap-6">
                <div className="h-9 w-48 bg-zinc-200 rounded-lg animate-pulse mb-2" />
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
            </div>

            {/* Order summary */}
            <div className="lg:w-1/3">
                <div className="bg-zinc-50 p-6 sm:p-8 rounded-3xl border border-zinc-200">
                    <div className="h-6 w-36 bg-zinc-200 rounded animate-pulse mb-6" />

                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex justify-between">
                            <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between pb-5 border-b border-zinc-200">
                            <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between pt-2">
                            <div className="h-6 w-12 bg-zinc-200 rounded animate-pulse" />
                            <div className="h-8 w-28 bg-zinc-200 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Coupon input */}
                    <div className="mb-8">
                        <div className="h-3 w-24 bg-zinc-200 rounded animate-pulse mb-2" />
                        <div className="h-12 bg-zinc-200 rounded-xl animate-pulse" />
                    </div>

                    {/* Checkout button */}
                    <div className="h-14 bg-zinc-200 rounded-2xl animate-pulse mb-6" />
                    <div className="h-3 w-40 bg-zinc-200 rounded animate-pulse mx-auto" />
                </div>
            </div>
        </div>
    );
}
