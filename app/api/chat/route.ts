import { GoogleGenerativeAI, type Content } from '@google/generative-ai'
import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import {
  searchProducts,
  getProductDetails,
  addToCartTool,
  getCartContents,
  getOrderStatus,
  ALL_TOOL_DECLARATIONS,
  type Product,
} from '@/lib/ai/tools'
import { SearchFilters } from '@/lib/types'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) throw new Error('GEMINI_API_KEY is required')
const genAI = new GoogleGenerativeAI(apiKey)

const SYSTEM_INSTRUCTION = `You are a helpful shopping assistant for an Indian ecommerce store selling clothing, electronics, and gifts.

You have access to these tools:
- searchProducts: find products by filters
- getProductDetails: get full info on a specific product
- addToCart: add a product to the user's cart
- getCartContents: see what's in the user's cart
- getOrderStatus: check the user's recent orders

Guidelines:
- When a user asks about products, always search first before answering
- CRITICAL: Before calling addToCart, you MUST call searchProducts first in the same turn to get the product ID. Never use a product name or a recalled ID from previous messages — always search fresh and use the ID from the search result.
- When the user says "add the first one", "add that", or refers to a previously shown product, search for it again using the same filters or product name, then use the first result's ID.
- Be concise and friendly
- Format prices with ₹
- If the user asks something unrelated to shopping, politely redirect them
- The UI shows product cards separately, so just describe what you found naturally`

type IncomingMessage = { role: 'user' | 'assistant'; content: string }

const MAX_TOOL_LOOPS = 5

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => controller.enqueue(encoder.encode(data))

      try {
        const body = (await request.json()) as { messages: IncomingMessage[] }
        const { messages } = body

        const cookieStore = await cookies()
        const userId = cookieStore.get('user_id')?.value
        const sessionId = cookieStore.get('session_id')?.value

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash-lite',
          tools: [{ functionDeclarations: ALL_TOOL_DECLARATIONS }],
          systemInstruction: SYSTEM_INSTRUCTION,
        })

        // Convert to Gemini content format
        let contents: Content[] = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

        // Tool call loop — Gemini may call multiple tools across turns
        for (let loop = 0; loop < MAX_TOOL_LOOPS; loop++) {
          const result = await model.generateContentStream({ contents })

          // Stream text chunks to the client as they arrive
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            if (chunkText) send(`data: ${JSON.stringify(chunkText)}\n\n`)
          }

          const response = await result.response
          const functionCalls = response.functionCalls()

          // No tool calls → text was already streamed above, stop
          if (!functionCalls || functionCalls.length === 0) {
            break
          }

          // Execute each tool call
          const functionResults: { name: string; result: unknown }[] = []

          for (const call of functionCalls) {
            const args = call.args as Record<string, unknown>
            let toolResult: unknown

            switch (call.name) {
              case 'searchProducts': {
                const prods = await searchProducts(args as SearchFilters)
                toolResult = prods
                send(`data: __PRODUCTS__${JSON.stringify(prods)}\n\n`)
                break
              }
              case 'getProductDetails': {
                if (typeof args.productId !== 'string' || !args.productId) {
                  toolResult = { error: 'productId is required' }
                  break
                }
                toolResult = await getProductDetails(args.productId)
                break
              }
              case 'addToCart': {
                if (typeof args.productId !== 'string' || !args.productId) {
                  toolResult = { error: 'productId is required' }
                  break
                }
                const qty = typeof args.quantity === 'number' && args.quantity > 0 ? args.quantity : 1
                toolResult = await addToCartTool(args.productId, qty, userId, sessionId)
                const res = toolResult as { success: boolean }
                if (res.success) send(`data: __CART_UPDATED__\n\n`)
                break
              }
              case 'getCartContents': {
                toolResult = await getCartContents(userId, sessionId)
                break
              }
              case 'getOrderStatus': {
                if (!userId) {
                  toolResult = { error: 'You need to be logged in to view orders' }
                } else {
                  toolResult = await getOrderStatus(userId)
                }
                break
              }
              default:
                toolResult = { error: 'Unknown tool' }
            }

            functionResults.push({ name: call.name, result: toolResult })
          }

          // Append the model's tool calls + our results to contents for next loop
          contents = [
            ...contents,
            {
              role: 'model',
              parts: functionCalls.map((c) => ({
                functionCall: { name: c.name, args: c.args },
              })),
            },
            {
              role: 'user',
              parts: functionResults.map((r) => ({
                functionResponse: {
                  name: r.name,
                  response: { result: JSON.stringify(r.result) },
                },
              })),
            },
          ]
        }

        send('data: [DONE]\n\n')
        controller.close()
      } catch (err) {
        const name = err instanceof Error ? err.name : 'UnknownError'
        const code = (err as Record<string, unknown>).code as string | undefined
        const status = (err as Record<string, unknown>).status as number | undefined

        let userMessage = 'Something went wrong'
        if (status === 429 || code === 'RESOURCE_EXHAUSTED') {
          userMessage = 'Rate limit reached, please retry later'
        } else if (status === 400) {
          userMessage = 'Invalid request'
        } else if (code === 'ENOTFOUND' || code === 'ECONNREFUSED') {
          userMessage = 'Service unavailable, please try again'
        }

        console.error('Chat API error:', { name, code, status })
        send(`data: __ERROR__${userMessage}\n\n`)
        send('data: [DONE]\n\n')
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
