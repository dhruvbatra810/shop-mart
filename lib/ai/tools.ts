import { buildProductQuery } from '@/lib/search/query-builder'
import { SearchFilters } from '@/lib/types'
import { SchemaType, type FunctionDeclaration } from '@google/generative-ai'
import { db } from '@/db'
import { carts, orders, products } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

export type Product = {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  category?: string
  occasion?: string | null
}

// ─── Tool functions ────────────────────────────────────────────────────────────

export async function searchProducts(filters: SearchFilters): Promise<Product[]> {
  const results = await buildProductQuery(filters)
  return results as Product[]
}

export async function getProductDetails(productId: string) {
  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  return result[0] ?? null
}

export async function addToCartTool(
  productId: string,
  quantity: number,
  userId?: string,
  sessionId?: string
) {
  if (!userId && !sessionId) return { success: false, error: 'Could not identify user session' }

  const productRow = await db
    .select({ id: products.id, name: products.name, stock: products.stock })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  if (!productRow[0]) return { success: false, error: 'Product not found' }
  if (productRow[0].stock < quantity)
    return { success: false, error: `Only ${productRow[0].stock} left in stock` }

  if (userId) {
    await db
      .insert(carts)
      .values({ id: crypto.randomUUID(), userId, productId, quantity })
      .onConflictDoUpdate({
        target: [carts.userId, carts.productId],
        set: { quantity: sql`${carts.quantity} + ${quantity}` },
      })
  } else if (sessionId) {
    await db
      .insert(carts)
      .values({ id: crypto.randomUUID(), sessionId, productId, quantity })
      .onConflictDoUpdate({
        target: [carts.sessionId, carts.productId],
        set: { quantity: sql`${carts.quantity} + ${quantity}` },
      })
  }

  return { success: true, productName: productRow[0].name, quantity }
}

export async function getCartContents(userId?: string, sessionId?: string) {
  if (userId) {
    return await db
      .select({ name: products.name, price: products.price, quantity: carts.quantity, productId: carts.productId })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.userId, userId))
  }
  if (sessionId) {
    return await db
      .select({ name: products.name, price: products.price, quantity: carts.quantity, productId: carts.productId })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.sessionId, sessionId))
  }
  return []
}

export async function getOrderStatus(userId: string) {
  return await db
    .select({ id: orders.id, status: orders.status, total: orders.total, createdAt: orders.createdAt })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(5)
}

// ─── Gemini tool declarations ──────────────────────────────────────────────────

export const searchProductsDeclaration = {
  name: 'searchProducts',
  description:
    'Search products in the database by category, price range, occasion, or keywords. Call this whenever the user asks about products, wants recommendations, or asks what items are available.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      category: { type: SchemaType.STRING, description: 'Product category: mens, womens, electronics, gifts' },
      maxPrice: { type: SchemaType.NUMBER, description: 'Maximum price in rupees' },
      minPrice: { type: SchemaType.NUMBER, description: 'Minimum price in rupees' },
      occasion: { type: SchemaType.STRING, description: 'Occasion: casual, wedding, office, party, festival' },
      keywords: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Keywords to search in product name and description',
      },
      name: { type: SchemaType.STRING, description: 'Partial product name to search for' },
      inStock: { type: SchemaType.BOOLEAN, description: 'Filter to only in-stock items' },
    },
    required: [],
  },
}

export const getProductDetailsDeclaration = {
  name: 'getProductDetails',
  description:
    'Get full details of a specific product by its ID — stock count, description, occasion, price. Use this before recommending a specific item or when the user asks for more info about a product.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      productId: { type: SchemaType.STRING, description: 'The product ID' },
    },
    required: ['productId'],
  },
}

export const addToCartDeclaration = {
  name: 'addToCart',
  description:
    "Add a product to the user's shopping cart. Only call this when the user explicitly asks to add something to their cart. If you don't have the product ID yet, search for the product first.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      productId: { type: SchemaType.STRING, description: 'The product ID to add to cart' },
      quantity: { type: SchemaType.NUMBER, description: 'Quantity to add, defaults to 1' },
    },
    required: ['productId'],
  },
}

export const getCartContentsDeclaration = {
  name: 'getCartContents',
  description: "Get the current contents of the user's shopping cart — items, quantities, prices. Call this when the user asks what's in their cart or wants a cart summary.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {},
    required: [],
  },
}

export const getOrderStatusDeclaration = {
  name: 'getOrderStatus',
  description: "Get the user's recent orders and their current status. Only works for logged-in users.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {},
    required: [],
  },
}

export const ALL_TOOL_DECLARATIONS = [
  searchProductsDeclaration,
  getProductDetailsDeclaration,
  addToCartDeclaration,
  getCartContentsDeclaration,
  getOrderStatusDeclaration,
] as unknown as FunctionDeclaration[]
