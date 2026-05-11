'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  category?: string
  occasion?: string
}

const BROWSE_HISTORY_KEY = 'browse_history'
const MAX_HISTORY = 10

function updateBrowseHistory(productId: string): string[] {
  try {
    const raw = localStorage.getItem(BROWSE_HISTORY_KEY)
    const history: string[] = raw ? JSON.parse(raw) : []
    const updated = [productId, ...history.filter((id) => id !== productId)].slice(0, MAX_HISTORY)
    localStorage.setItem(BROWSE_HISTORY_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return [productId]
  }
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-48 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function RecommendationsSection({ currentProductId }: { currentProductId: string }) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const history = updateBrowseHistory(currentProductId)

    fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewedProductIds: history, currentProductId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.products ?? [])
      })
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false))
  }, [currentProductId])

  if (!loading && recommendations.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        You might also like
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : recommendations.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex-shrink-0 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
