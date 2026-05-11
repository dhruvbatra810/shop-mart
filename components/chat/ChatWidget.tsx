'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useChatStore, type ChatProduct } from '@/store/chatStore'

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function MiniProductCard({ product }: { product: ChatProduct }) {
  return (
    <a
      href={`/products/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="144px"
        />
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{product.name}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">₹{product.price}</p>
      </div>
    </a>
  )
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function ChatWidget() {
  const {
    messages,
    isOpen,
    isLoading,
    addUserMessage,
    startAssistantMessage,
    appendToMessage,
    setMessageProducts,
    finalizeMessage,
    setIsOpen,
  } = useChatStore()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    addUserMessage(text)
    const id = startAssistantMessage()

    try {
      const apiMessages = messages
        .filter((m) => !m.isStreaming)
        .map((m) => ({ role: m.role, content: m.content }))
      apiMessages.push({ role: 'user', content: text })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)

          if (data === '[DONE]') {
            finalizeMessage(id)
          } else if (data.startsWith('__PRODUCTS__')) {
            try {
              const prods: ChatProduct[] = JSON.parse(data.slice(12))
              setMessageProducts(id, prods)
            } catch {
              // ignore parse errors
            }
          } else if (data === '__CART_UPDATED__') {
            // Refresh the page cart count by reloading the navbar area
            window.dispatchEvent(new CustomEvent('cart-updated'))
          } else if (data.startsWith('__ERROR__')) {
            appendToMessage(id, data.slice(9))
            finalizeMessage(id)
          } else {
            try {
              appendToMessage(id, JSON.parse(data))
            } catch {
              appendToMessage(id, data)
            }
          }
        }
      }
    } catch {
      appendToMessage(id, 'Something went wrong. Please try again.')
      finalizeMessage(id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-90 h-130 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Shopping Assistant</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Ask me anything about our products</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Try asking: &ldquo;Show me kurtas under ₹1000&rdquo; or &ldquo;Gifts for my sister&rdquo;
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'w-full'}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-br-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
                    }`}
                  >
                    {message.content}
                    {message.isStreaming && message.content && (
                      <span className="inline-block w-px h-4 bg-current ml-0.5 animate-pulse" />
                    )}
                  </div>

                  {message.isStreaming && !message.content && <LoadingDots />}

                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {message.products.map((p) => (
                        <MiniProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm">
                  <LoadingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products..."
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 max-h-20 py-1"
                style={{ minHeight: '24px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shrink-0"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open shopping assistant'}
        className="w-14 h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  )
}
