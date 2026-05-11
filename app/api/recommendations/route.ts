import { GoogleGenerativeAI } from '@google/generative-ai'
import { type NextRequest } from 'next/server'
import { db } from '@/db'
import { products } from '@/db/schema'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      viewedProductIds: string[]
      currentProductId: string
    }
    const { viewedProductIds, currentProductId } = body

    const allProducts = await db.select().from(products).limit(50)
    const currentProduct = allProducts.find((p) => p.id === currentProductId)

    if (!currentProduct) {
      const fallback = allProducts
        .filter((p) => p.id !== currentProductId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
      return Response.json({ products: fallback })
    }

    const recentlyViewed = allProducts
      .filter((p) => viewedProductIds.includes(p.id) && p.id !== currentProductId)
      .slice(0, 5)
      .map((p) => p.name)
      .join(', ')

    const catalog = allProducts
      .filter((p) => p.id !== currentProductId)
      .map((p) => ({ id: p.id, name: p.name, category: p.category, occasion: p.occasion, price: p.price }))

    const prompt = `Given that a user is viewing "${currentProduct.name}" (${currentProduct.category}, ${currentProduct.occasion ?? 'general'}, ₹${currentProduct.price}) and has recently viewed: ${recentlyViewed || 'nothing yet'}, select exactly 4 product IDs from the catalog that they would most likely want to buy next.

Catalog: ${JSON.stringify(catalog)}

Return ONLY a JSON array of 4 product ID strings. No explanation.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    const recommendedIds: string[] = JSON.parse(clean)

    const recommended = allProducts.filter(
      (p) => recommendedIds.includes(p.id) && p.id !== currentProductId
    )

    if (recommended.length === 0) {
      const fallback = allProducts
        .filter((p) => p.id !== currentProductId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
      return Response.json({ products: fallback })
    }

    return Response.json({ products: recommended.slice(0, 4) })
  } catch (err) {
    console.error('Recommendations error:', err)
    return Response.json({ products: [] })
  }
}
