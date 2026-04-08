// lib/search/query-builder.ts
import { db } from '@/db'
import { products } from '@/db/schema'
import { and, lte, gte, ilike, or, eq, gt } from 'drizzle-orm'
import { SearchFilters } from '@/lib/types'

export async function buildProductQuery(filters: SearchFilters) {
    const conditions = []

    // exact category match
    if (filters.category) {
        conditions.push(eq(products.category, filters.category))
    }

    // price range
    if (filters.maxPrice) {
        conditions.push(lte(products.price, filters.maxPrice.toString()))
    }
    if (filters.minPrice) {
        conditions.push(gte(products.price, filters.minPrice.toString()))
    }

    // exact price (rarely used but supported)
    if (filters.price) {
        conditions.push(eq(products.price, filters.price.toString()))
    }

    // name partial match
    if (filters.name) {
        conditions.push(ilike(products.name, `%${filters.name}%`))
    }

    // description partial match
    if (filters.description) {
        conditions.push(ilike(products.description, `%${filters.description}%`))
    }

    // occasion partial match
    if (filters.occasion) {
        conditions.push(ilike(products.occasion, `%${filters.occasion}%`))
    }

    // stock — exact or inStock boolean
    if (filters.inStock === true) {
        conditions.push(gt(products.stock, 0))   // stock > 0
    }
    if (filters.inStock === false) {
        conditions.push(eq(products.stock, 0))   // out of stock
    }
    if (filters.stock !== undefined) {
        conditions.push(gte(products.stock, filters.stock))  // at least N in stock
    }

    // keywords — search across name + description + occasion
    if (filters.keywords?.length) {
        const keywordConditions = filters.keywords.map((keyword) =>
            or(
                ilike(products.name, `%${keyword}%`),
                ilike(products.description, `%${keyword}%`),
                ilike(products.occasion, `%${keyword}%`),
            )
        )
        conditions.push(or(...keywordConditions))
    }

    const results = await db
        .select()
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(20)

    return results
}