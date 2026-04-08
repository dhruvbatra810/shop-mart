// app/api/search/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildProductQuery } from '@/lib/search/query-builder'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

export async function POST(req: Request) {
  const { query } = await req.json()

  if (!query?.trim()) {
    return Response.json({ error: 'Query is required' }, { status: 400 })
  }

  try {
    // Step 1: Gemini extracts filters
    const prompt = `You extract product search filters from natural language queries.
  Return ONLY valid JSON using these fields:
  {
    "category": string,
    "name": string,
    "description": string,
    "occasion": string,       // e.g. "wedding", "casual", "festival"
    "keywords": string[],
    "minPrice": number,
    "maxPrice": number,
    "price": number,          // only if user asks exact price
    "inStock": boolean,       // true if user says "available" or "in stock"
    "stock": number           // only if user asks for minimum stock quantity
  }
  Omit any field not mentioned. No explanation, just JSON.

  Query: ${query}`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    const filters = JSON.parse(clean)

    // Step 2: Drizzle builds and runs the query
    const products = await buildProductQuery(filters)

    return Response.json({ products, filters }) // return filters too for debugging

  } catch (err) {
    console.error('Search error:', err)
    return Response.json({ error: 'Search failed' }, { status: 500 })
  }
}