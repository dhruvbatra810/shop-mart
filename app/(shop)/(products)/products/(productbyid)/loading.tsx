export default function Loading() {
    return (
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-white h-full flex-1">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">

                {/* Image */}
                <div className="w-full md:w-1/2">
                    <div className="aspect-square w-full rounded-3xl bg-zinc-200 animate-pulse" />
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
                    {/* Category */}
                    <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse" />
                    {/* Name */}
                    <div className="h-10 w-3/4 bg-zinc-200 rounded-lg animate-pulse" />
                    {/* Price */}
                    <div className="h-8 w-24 bg-zinc-200 rounded-lg animate-pulse" />
                    {/* Description lines */}
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="h-4 bg-zinc-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-200 rounded animate-pulse w-2/3" />
                    </div>
                    {/* Availability badge */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
                        <div className="h-6 w-32 bg-zinc-200 rounded-full animate-pulse" />
                    </div>
                    {/* Button */}
                    <div className="mt-10 border-t border-zinc-200 pt-8">
                        <div className="h-10 w-48 bg-zinc-200 rounded-lg animate-pulse" />
                    </div>
                </div>

            </div>
        </div>
    );
}
