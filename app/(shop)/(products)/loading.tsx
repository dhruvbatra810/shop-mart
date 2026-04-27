function ProductCardSkeleton() {
    return (
        <div className="flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            {/* Image */}
            <div className="aspect-square w-full bg-zinc-200 animate-pulse" />

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Name + price row */}
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-zinc-200 rounded animate-pulse flex-1 mr-4" />
                    <div className="h-4 w-12 bg-zinc-200 rounded animate-pulse shrink-0" />
                </div>

                {/* Description lines */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 bg-zinc-200 rounded animate-pulse w-full" />
                    <div className="h-3 bg-zinc-200 rounded animate-pulse w-3/4" />
                </div>

                {/* Button */}
                <div className="h-9 bg-zinc-200 rounded-lg animate-pulse mt-1" />
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="bg-white p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
