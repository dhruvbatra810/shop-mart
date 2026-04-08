import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { db } from '@/db'
import { users, carts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      const existingUsers = await db.select().from(users).where(eq(users.email, user.email))

      let userId: string
      if (existingUsers.length === 0) {
        userId = crypto.randomUUID()
        await db.insert(users).values({
          id: userId,
          name: user.name || null,
          email: user.email,
          image: user.image || null,
        })
      } else {
        userId = existingUsers[0].id
      }

      const cookieStore = await cookies()
      const sessionId = cookieStore.get('session_id')?.value

      if (sessionId) {
        const anonCartItems = await db.select().from(carts).where(eq(carts.sessionId, sessionId))

        for (const item of anonCartItems) {
          const existingCartItem = await db.select().from(carts).where(
            and(eq(carts.userId, userId), eq(carts.productId, item.productId))
          )

          if (existingCartItem.length > 0) {
            await db.update(carts)
              .set({ quantity: existingCartItem[0].quantity + item.quantity })
              .where(eq(carts.id, existingCartItem[0].id))
            await db.delete(carts).where(eq(carts.id, item.id))
          } else {
            await db.update(carts)
              .set({ userId, sessionId: null })
              .where(eq(carts.id, item.id))
          }
        }
      }

      cookieStore.set('user_id', userId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      cookieStore.delete('session_id')

      revalidatePath('/')

      return true
    }
  },
  events: {
    async signOut() {
      const cookieStore = await cookies()

      cookieStore.delete('user_id')

      cookieStore.set('session_id', crypto.randomUUID(), {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })

      revalidatePath('/')
    }
  }
})